const fs = require('fs');
const path = require('path');

const ccrDir = path.join(process.env.APPDATA, 'npm/node_modules/claude-code-router');
const pristinePath = path.join(ccrDir, 'dist/cli.js.pristine');
const cliPath = path.join(ccrDir, 'dist/cli.js');

if (!fs.existsSync(cliPath)) {
  console.log('CCR cli.js not found at:', cliPath);
  process.exit(0);
}

// Guarantee a pristine baseline exists
if (!fs.existsSync(pristinePath)) {
  fs.copyFileSync(cliPath, pristinePath);
  console.log('Pristine backup created at:', pristinePath);
}

let cli = fs.readFileSync(pristinePath, 'utf8');

// 1. Guard sendSSEEvent
const sendSseOld = `  sendSSEEvent(reply, event, data) {
    const eventData = JSON.stringify(data);
    reply.raw.write(\`event: \${event}
\`);
    reply.raw.write(\`data: \${eventData}

\`);
  }`;

const sendSseNew = `  sendSSEEvent(reply, event, data) {
    if (!reply || !reply.raw || reply.raw.writableEnded || !reply.raw.writable) return;
    try {
      const eventData = JSON.stringify(data);
      reply.raw.write(\`event: \${event}\\n\`);
      reply.raw.write(\`data: \${eventData}\\n\\n\`);
    } catch (e) {}
  }`;

if (cli.includes(sendSseOld)) {
  cli = cli.replace(sendSseOld, sendSseNew);
  console.log('1. sendSSEEvent safely guarded.');
}

// 2. Patch handleStreamingRequest with SSE Keepalive Ping + Dynamic Auto-Failover
const methodHeader = 'async handleStreamingRequest(request, provider, reply, requestId) {';
const methodEndMarker = '  sendSSEEvent(reply, event, data) {';

const startIdx = cli.indexOf(methodHeader);
const endIdx = cli.indexOf(methodEndMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const cleanStreamingMethod = `// PATCHED_STREAMING_V10_FAILOVER
  async handleStreamingRequest(request, provider, reply, requestId) {
    let keepAliveTimer = null;
    try {
      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
      });

      // Keepalive ping: Envia comentários SSE a cada 3s para resetar o watchdog do Claude Code
      keepAliveTimer = setInterval(() => {
        if (!reply.raw.writableEnded && reply.raw.writable) {
          try { reply.raw.write(": keepalive\\n\\n"); } catch (e) {}
        }
      }, 3000);

      try {
        for await (const chunk of provider.sendStreamRequest(request)) {
          if (reply.raw.writableEnded || !reply.raw.writable) break;
          this.sendSSEEvent(reply, chunk.event, chunk.data);
          if (chunk.event === "message_stop") {
            try { reply.raw.end(); } catch (e) {}
            break;
          }
        }
      } catch (streamErr) {
        // AUTO-FAILOVER: Se falhar no LM Studio ou Gemini, redireciona transparentemente para modelo alternativo
        const geminiProv = this.providers.get("gemini-provider");
        if (geminiProv && !reply.raw.writableEnded && reply.raw.writable) {
          const fallbackModel = (request.model === "gemini-3.5-flash-lite") ? "gemini-3.1-flash-lite" : "gemini-3.5-flash-lite";
          logger.warn(\`[AUTO-FAILOVER] Falha na execução (\${request.model || 'provedor'}: \${streamErr.message || streamErr}). Redirecionando transparentemente para \${fallbackModel}...\`, {}, requestId, "server");
          const fbReq = Object.assign({}, request);
          fbReq.model = fallbackModel;
          for await (const fbChunk of geminiProv.sendStreamRequest(fbReq)) {
            if (reply.raw.writableEnded || !reply.raw.writable) break;
            this.sendSSEEvent(reply, fbChunk.event, fbChunk.data);
            if (fbChunk.event === "message_stop") {
              try { reply.raw.end(); } catch (e) {}
              break;
            }
          }
        } else {
          throw streamErr;
        }
      }

      if (keepAliveTimer) clearInterval(keepAliveTimer);
      if (!reply.raw.writableEnded && reply.raw.writable) {
        try { reply.raw.end(); } catch (e) {}
      }
    } catch (error) {
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      logger.error("Streaming request failed", error, requestId, "server");
      const errorMessage = error instanceof Error ? error.message : "Stream processing failed";
      this.sendSSEEvent(reply, "error", {
        type: "error",
        error: {
          type: "overloaded_error",
          message: errorMessage
        }
      });
      try { reply.raw.end(); } catch (e) {}
    }
  }

`;
  cli = cli.substring(0, startIdx) + cleanStreamingMethod + cli.substring(endIdx);
  console.log('2. handleStreamingRequest patched with SSE keepalive + Dynamic Auto-Failover.');
}

// 3. Patch determineCategory to detect /btw and 20k Predictive Threshold
const detOld = `  determineCategory(request) {
    if (request.metadata?.thinking) {
      return "thinking";
    }
    const tokenCount = this.calculateRequestTokens(request);
    if (tokenCount > 6e4) {
      return "longcontext";
    }
    if (request.model.includes("haiku")) {
      return "background";
    }`;

const detNew = `  determineCategory(request) {
    // Multi-Agent /btw detection: forkOrigin "btw" or side questions
    if (request.metadata?.forkOrigin === "btw" || request.metadata?.sideQuestion) {
      return "background";
    }
    const msgs = request.messages || [];
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
    const lastStr = typeof lastMsg?.content === "string" ? lastMsg.content : (Array.isArray(lastMsg?.content) ? JSON.stringify(lastMsg.content) : "");
    if (lastStr.includes('forkOrigin: "btw"') || lastStr.includes("/btw ") || lastStr.startsWith("[btw]")) {
      return "background";
    }
    if (request.metadata?.thinking) {
      return "thinking";
    }
    const tokenCount = this.calculateRequestTokens(request);
    // Predictive Threshold 20k: On Quadro T1000 4GB VRAM, prompts > 20k tokens take >60s.
    // Route prompts > 20k tokens to Gemini 1M longcontext (1.2s TTFT, 0% host RAM/VRAM)
    if (tokenCount > 20000) {
      return "longcontext";
    }
    if (request.model.includes("haiku")) {
      return "background";
    }`;

if (cli.includes(detOld)) {
  cli = cli.replace(detOld, detNew);
  console.log('3. determineCategory patched for /btw & 20k Predictive Threshold.');
}

// 4. Inject Dynamic Model Routing in route() with Multi-Agent Category priority
const routeTarget = `      const category = this.determineCategory(request);
      logger.debug(\`Determined routing category: \${category}\`, { requestId }, requestId, "routing");
      const categoryProvider = this.routeByCategory(request, category);
      if (categoryProvider) {
        logger.info(\`Routing by category to provider: \${categoryProvider}\`, { category }, requestId, "routing");
        this.applyModelMapping(request, categoryProvider, category);
        return categoryProvider;
      }`;

const routeReplacement = `      const category = this.determineCategory(request);
      logger.debug(\`Determined routing category: \${category}\`, { requestId }, requestId, "routing");

      // For background, longcontext, search: let category rule route to Gemini!
      if (category === "background" || category === "longcontext" || category === "search") {
        const catProv = this.routeByCategory(request, category);
        if (catProv) {
          logger.info(\`Multi-Agent Hybrid Route: '\${category}' -> \${catProv} (0% host RAM/VRAM)\`, { category }, requestId, "routing");
          this.applyModelMapping(request, catProv, category);
          return catProv;
        }
      }

      // Dynamic model routing (e.g. via /model) for Primary Coder
      if (request.model) {
        for (const [pId, pConf] of Object.entries(this.config.providers || {})) {
          const pModels = pConf.settings?.models || [];
          if (pModels.includes(request.model) || pConf.settings?.defaultModel === request.model ||
              (pId.startsWith("lmstudio") && (request.model.startsWith("qwen") || request.model.startsWith("deepseek"))) ||
              (pId.startsWith("gemini") && request.model.startsWith("gemini"))) {
            logger.info(\`Dynamic model route: \${request.model} -> \${pId}\`, {}, requestId, "routing");
            return pId;
          }
        }
      }

      const categoryProvider = this.routeByCategory(request, category);
      if (categoryProvider) {
        logger.info(\`Routing by category to provider: \${categoryProvider}\`, { category }, requestId, "routing");
        this.applyModelMapping(request, categoryProvider, category);
        return categoryProvider;
      }`;

if (cli.includes(routeTarget)) {
  cli = cli.replace(routeTarget, routeReplacement);
  console.log('4. Dynamic routing + Multi-Agent category priority injected into route().');
}

// 5. Patch AnthropicInputProcessor to support both string and array system prompt
const canProcOld = `  canProcess(request) {
    try {
      return typeof request === "object" && request !== null && Array.isArray(request.messages) && // Anthropic uses 'system' as array, OpenAI uses string
      (Array.isArray(request.system) || request.system === void 0) && // Check for Anthropic-style tools format
      (!request.tools || this.isAnthropicToolsFormat(request.tools));
    } catch (error) {`;

const canProcNew = `  canProcess(request) {
    try {
      return typeof request === "object" && request !== null && Array.isArray(request.messages) &&
      (Array.isArray(request.system) || typeof request.system === "string" || request.system === void 0) &&
      (!request.tools || this.isAnthropicToolsFormat(request.tools));
    } catch (error) {`;

if (cli.includes(canProcOld)) {
  cli = cli.replace(canProcOld, canProcNew);
  console.log('5. AnthropicInputProcessor.canProcess patched to accept string system prompt.');
}

const valSysOld = `  if (request.system !== void 0) {
    if (!Array.isArray(request.system)) {
      throw new ValidationError("System must be an array");
    }
    for (let i = 0; i < request.system.length; i++) {
      const systemMsg = request.system[i];
      if (!systemMsg || typeof systemMsg !== "object") {
        throw new ValidationError(\`System message at index \${i} must be an object\`);
      }
      if (systemMsg.type !== "text") {
        throw new ValidationError(\`System message at index \${i} must have type "text"\`);
      }
      if (!systemMsg.text || typeof systemMsg.text !== "string") {
        throw new ValidationError(\`System message at index \${i} must have text field\`);
      }
    }
  }`;

const valSysNew = `  if (request.system !== void 0) {
    if (typeof request.system === "string") {
      request.system = [{ type: "text", text: request.system }];
    } else if (Array.isArray(request.system)) {
      for (let i = 0; i < request.system.length; i++) {
        const systemMsg = request.system[i];
        if (typeof systemMsg === "string") {
          request.system[i] = { type: "text", text: systemMsg };
        } else if (!systemMsg || typeof systemMsg !== "object") {
          throw new ValidationError(\`System message at index \${i} must be an object\`);
        } else if (systemMsg.type !== "text") {
          systemMsg.type = "text";
        }
      }
    }
  }`;

if (cli.includes(valSysOld)) {
  cli = cli.replace(valSysOld, valSysNew);
  console.log('6. validateAnthropicRequest patched to normalize string and array system prompt.');
}

// 7. Auto-load LM Studio + Dynamic Non-Streaming Auto-Failover in handleMessagesRequest
const targetProviderCheck = `      const provider = this.providers.get(providerId);
      if (!provider) {
        throw new Error(\`Provider not found: \${providerId}\`);
      }
      let providerResponse;
      if (baseRequest.stream) {
        return this.handleStreamingRequest(baseRequest, provider, reply, requestId);
      } else {
        providerResponse = await provider.sendRequest(baseRequest);
      }`;

const replacementProviderCheck = `      let activeProviderId = providerId;
      let provider = this.providers.get(activeProviderId);
      if (!provider) {
        throw new Error(\`Provider not found: \${activeProviderId}\`);
      }

      // Auto-load local model into LM Studio with animated progress bar if needed
      if (activeProviderId.includes("lmstudio") && baseRequest.model) {
        try {
          const lmsMgrPath = require("path").join(process.cwd(), "core", "scripts", "lms-manager.js");
          if (require("fs").existsSync(lmsMgrPath)) {
            const { ensureModelLoaded } = require(lmsMgrPath);
            await ensureModelLoaded(baseRequest.model, 65536);
          }
        } catch (lmsErr) {
          logger.warn("Auto LM Studio load error: " + (lmsErr.message || lmsErr));
        }
      }

      let providerResponse;
      if (baseRequest.stream) {
        return this.handleStreamingRequest(baseRequest, provider, reply, requestId);
      } else {
        try {
          providerResponse = await provider.sendRequest(baseRequest);
        } catch (reqErr) {
          const geminiProv = this.providers.get("gemini-provider");
          if (geminiProv) {
            const fallbackModel = (baseRequest.model === "gemini-3.5-flash-lite") ? "gemini-3.1-flash-lite" : "gemini-3.5-flash-lite";
            logger.warn(\`[AUTO-FAILOVER] Falha na execução (\${baseRequest.model || activeProviderId}: \${reqErr.message || reqErr}). Redirecionando transparentemente para \${fallbackModel}...\`, {}, requestId, "server");
            const fbReq = Object.assign({}, baseRequest);
            fbReq.model = fallbackModel;
            providerResponse = await geminiProv.sendRequest(fbReq);
          } else {
            throw reqErr;
          }
        }
      }`;

if (cli.includes(targetProviderCheck)) {
  cli = cli.replace(targetProviderCheck, replacementProviderCheck);
  console.log('7. handleMessagesRequest patched with dynamic lms-manager + Non-Streaming Auto-Failover.');
}

// 8. Patch calculateRequestTokens to count system and tools accurately
const calcReqOld = `  calculateRequestTokens(request) {
    try {
      return calculateTokenCount(
        request.messages,
        request.metadata?.system,
        request.metadata?.tools
      );
    } catch (error) {`;

const calcReqNew = `  calculateRequestTokens(request) {
    try {
      const sys = request.system || request.metadata?.system;
      const tls = request.tools || request.metadata?.tools;
      return calculateTokenCount(
        request.messages,
        sys,
        tls
      );
    } catch (error) {`;

if (cli.includes(calcReqOld)) {
  cli = cli.replace(calcReqOld, calcReqNew);
  console.log('8. calculateRequestTokens patched to count system and tools.');
}

// 9. Patch applyModelMapping to PRESERVE user-chosen model if compatible with provider
const mapOld = `  applyModelMapping(request, providerId, category) {
    const configRules = this.config.routing?.rules || this.config.rules;
    if (configRules && typeof configRules === "object" && !Array.isArray(configRules)) {
      const categoryRule = configRules[category];
      if (categoryRule && categoryRule.model) {
        const originalModel = request.model;
        request.model = categoryRule.model;
        logger.debug(\`Model mapped from \${originalModel} to \${request.model} for \${providerId}\`, {
          category,
          providerId,
          originalModel,
          newModel: request.model
        });
        return;
      }
    }
    const providerConfig = this.config.providers[providerId];
    if (providerConfig?.settings?.models && providerConfig.settings.models.length > 0) {
      const originalModel = request.model;
      request.model = providerConfig.settings.models[0];
      logger.debug(\`Model mapped to provider default: \${originalModel} -> \${request.model}\`, {
        category,
        providerId,
        originalModel,
        newModel: request.model
      });
    }
  }`;

const mapNew = `  applyModelMapping(request, providerId, category) {
    // Preserve requested model if already compatible with provider
    const providerConfig = this.config.providers[providerId];
    if (request.model) {
      const pModels = providerConfig?.settings?.models || [];
      if (pModels.includes(request.model) ||
          (providerId.startsWith("gemini") && request.model.startsWith("gemini")) ||
          (providerId.startsWith("lmstudio") && request.model.startsWith("qwen"))) {
        return;
      }
    }
    const configRules = this.config.routing?.rules || this.config.rules;
    if (configRules && typeof configRules === "object" && !Array.isArray(configRules)) {
      const categoryRule = configRules[category];
      if (categoryRule && categoryRule.model) {
        const originalModel = request.model;
        request.model = categoryRule.model;
        logger.debug(\`Model mapped from \${originalModel} to \${request.model} for \${providerId}\`, {
          category,
          providerId,
          originalModel,
          newModel: request.model
        });
        return;
      }
    }
    if (providerConfig?.settings?.models && providerConfig.settings.models.length > 0) {
      const originalModel = request.model;
      request.model = providerConfig.settings.models[0];
      logger.debug(\`Model mapped to provider default: \${originalModel} -> \${request.model}\`, {
        category,
        providerId,
        originalModel,
        newModel: request.model
      });
    }
  }`;

if (cli.includes(mapOld)) {
  cli = cli.replace(mapOld, mapNew);
  console.log('9. applyModelMapping patched to preserve compatible user-selected models.');
}

// 10. Inject Provider-Level Identity Guard in transformRequestFromUnified
const transOld = `  transformRequestFromUnified(request) {
    const openaiRequest = {
      model: request.model,
      messages: this.convertMessagesFromUnified(request.messages),
      max_tokens: request.max_tokens || 131072,
      temperature: request.temperature,
      stream: request.stream || false
    };
    if (request.system) {
      openaiRequest.messages.unshift({
        role: "system",
        content: request.system
      });
    }`;

const transNew = `  transformRequestFromUnified(request) {
    const openaiRequest = {
      model: request.model,
      messages: this.convertMessagesFromUnified(request.messages),
      max_tokens: request.max_tokens || 131072,
      temperature: request.temperature,
      stream: request.stream || false
    };
    const identityGuard = \`[IDENTIDADE DO MODELO ATIVO - FELTRIM AGENTS]\\nVocê é o modelo real '\${request.model}'. Você opera no ecossistema Feltrim Agents.\\nVocê NÃO é Claude Opus, NÃO é Claude Sonnet nem Claude Haiku da Anthropic.\\nQuando perguntado sobre sua identidade, modelo ou ao cumprimentar, declare claramente que você é '\${request.model}'.\\n\\n\`;
    const finalSystem = request.system ? identityGuard + request.system : identityGuard;
    openaiRequest.messages.unshift({
      role: "system",
      content: finalSystem
    });`;

if (cli.includes(transOld)) {
  cli = cli.replace(transOld, transNew);
  console.log('10. transformRequestFromUnified patched with Provider-Level Identity Guard (anti-Opus hallucination).');
}

// 11. Patch axios timeout to 300s
cli = cli.replaceAll('timeout: 6e4,', 'timeout: 300000,');
console.log('11. Axios timeout set to 300s.');

fs.writeFileSync(cliPath, cli, 'utf8');
console.log('SUCCESS: Claude Code Router cleanly patched with V10 (Identity Guard + Preserved Model Mapping + Dynamic Auto-Failover)!');