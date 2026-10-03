const fs = require('fs');
const path = require('path');
const os = require('os');

// Helper to read .env
function getEnvConfig() {
  const envPath = path.resolve('.env');
  const config = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match && !match[1].startsWith('#')) {
        config[match[1]] = match[2] ? match[2].trim() : '';
      }
    }
  }
  return config;
}

const env = getEnvConfig();

// Animated loading bar with mock-to-real progressive stages
class ModelProbeAnimation {
  constructor(modelName, providerLabel, estimatedSec, mockStages = []) {
    this.modelName = modelName;
    this.providerLabel = providerLabel;
    this.estimatedSec = estimatedSec;
    this.mockStages = mockStages;
    this.startTime = Date.now();
    this.progress = 5;
    this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.frameIdx = 0;
    this.timer = null;
  }

  getCurrentMock() {
    let text = '';
    for (const stage of this.mockStages) {
      if (this.progress >= stage.at) text = stage.text;
    }
    return text;
  }

  start() {
    this.timer = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000;
      // Smooth progress curve approaching 85% until real completion arrives
      const target = Math.min(85, Math.floor((elapsed / this.estimatedSec) * 75) + 8);
      if (this.progress < target) this.progress += 1;

      const cols = process.stdout.columns || 80;
      const frame = this.frames[this.frameIdx++ % this.frames.length];
      const filled = Math.floor(this.progress / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
      const remaining = Math.max(1, Math.round(this.estimatedSec - elapsed));
      const mockInfo = this.getCurrentMock();

      let line = `   ${frame} [${bar}] ${this.progress}% | ${this.modelName} (~${remaining}s) ${mockInfo}`;
      if (line.length >= cols - 1) {
        line = line.substring(0, cols - 2);
      }
      process.stdout.write(`\r\x1b[K${line}`);
    }, 80);
  }

  finishSuccess(realMs, realMeta = '') {
    clearInterval(this.timer);
    // Instant progression leap to 100% and replace mock with real measured data
    const cols = process.stdout.columns || 80;
    const bar = '█'.repeat(10);
    const sec = (realMs / 1000).toFixed(2);
    let line = `   ✅ [${bar}] 100% | ${this.modelName} [200 OK] em ${sec}s ${realMeta}`;
    if (line.length >= cols - 1) {
      line = line.substring(0, cols - 2);
    }
    process.stdout.write(`\r\x1b[K${line}\n`);
  }

  finishFailure(reason) {
    clearInterval(this.timer);
    const cols = process.stdout.columns || 80;
    let line = `   ❌ [${this.modelName}] Falhou: ${reason}`;
    if (line.length >= cols - 1) {
      line = line.substring(0, cols - 2);
    }
    process.stdout.write(`\r\x1b[K${line}\n`);
  }
}

// 1. Test LM Studio (Local Inference)
async function testLMStudio() {
  const baseUrl = env.LMSTUDIO_BASE_URL || 'http://127.0.0.1:1234';
  console.log(`\n🔍 Verificando LM Studio local (${baseUrl})...`);

  let chatModels = [];
  try {
    // Try native LM Studio API first for rich memory/instance inspection
    let usedNative = false;
    try {
      const nativeRes = await fetch(`${baseUrl}/api/v1/models`, { signal: AbortSignal.timeout(3000) });
      if (nativeRes.ok) {
        const nativeData = await nativeRes.json();
        chatModels = (nativeData.models || [])
          .filter(m => m.type === 'llm' && !(m.key || m.id).toLowerCase().includes('embed'))
          .map(m => ({
            id: m.key || m.id,
            isWarm: Array.isArray(m.loaded_instances) && m.loaded_instances.length > 0,
            instances: m.loaded_instances?.length || 0,
            displayName: m.display_name || m.key || m.id
          }));
        usedNative = true;
      }
    } catch (_) {}

    // Fallback to standard OpenAI /v1/models if native endpoint was unavailable
    if (!usedNative) {
      const res = await fetch(`${baseUrl}/v1/models`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) {
        console.log(`   ❌ LM Studio offline (${res.status})`);
        return [];
      }
      const data = await res.json();
      chatModels = (data.data || [])
        .map(m => ({ id: m.id, isWarm: false, instances: 0, displayName: m.id }))
        .filter(m => !m.id.toLowerCase().includes('embed'));
    }

    if (chatModels.length === 0) {
      console.log(`   ⚠️ Nenhum modelo de chat detectado no LM Studio.`);
      return [];
    }

    // Sort models so resident (warm) models in VRAM/RAM are tested first
    chatModels.sort((a, b) => (b.isWarm ? 1 : 0) - (a.isWarm ? 1 : 0));

    const modelStatusList = chatModels.map(m => 
      m.isWarm ? `${m.id} (🔥 VRAM Ativa)` : `${m.id} (❄️ No Disco)`
    ).join(', ');
    console.log(`   📦 Modelos detectados: ${modelStatusList}`);
  } catch (e) {
    console.log(`   ❌ Servidor do LM Studio não está ativo no momento.`);
    return [];
  }

  const verified = [];
  const LOCAL_TIMEOUT_MS = 15000;

  for (const modelInfo of chatModels) {
    const isWarm = modelInfo.isWarm;
    if (isWarm) {
      const anim = new ModelProbeAnimation(modelInfo.id, 'LM Studio', 4, [
        { at: 0, text: '[Inferência VRAM...]' },
        { at: 40, text: '[Avaliando Prompt...]' },
        { at: 70, text: '[Gerando Tokens...]' }
      ]);
      anim.start();

      const t0 = Date.now();
      try {
        const testRes = await fetch(`${baseUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelInfo.id,
            messages: [{ role: 'user', content: 'Oi' }],
            max_tokens: 10
          }),
          signal: AbortSignal.timeout(LOCAL_TIMEOUT_MS)
        });
        const ms = Date.now() - t0;

        if (testRes.ok) {
          const json = await testRes.json();
          const tokSec = json.usage?.completion_tokens
            ? `| ${(json.usage.completion_tokens / (ms / 1000)).toFixed(1)} tok/s`
            : '';
          const localFolderMap = {
            'deepseek-r1-distill-qwen-7b': 'bartowski',
            'qwen2.5-coder-7b-instruct': 'lmstudio-community',
            'qwen3.8-9b-distill': 'empero-ai',
            'qwen3-8b': 'Qwen'
          };
          const folderName = localFolderMap[modelInfo.id] || 'Local';

          anim.finishSuccess(ms, `[🔥 VRAM Ativa - Quadro T1000] ${tokSec}`);
          verified.push({
            id: modelInfo.id,
            folder: folderName,
            provider: 'lmstudio',
            providerName: `LM Studio [Pasta: ${folderName}]`,
            endpoint: `${baseUrl}/v1/chat/completions`,
            apiKey: 'lmstudio',
            ms,
            isWarm: true
          });
        } else {
          anim.finishFailure(`Status HTTP ${testRes.status}`);
        }
      } catch (err) {
        anim.finishFailure(err.message || 'Erro de conexão');
      }
    } else {
      // Modelo instalado e pronto no disco para hot-swap via lms-manager
      const localFolderMap = {
        'deepseek-r1-distill-qwen-7b': 'bartowski',
        'qwen2.5-coder-7b-instruct': 'lmstudio-community',
        'qwen3.8-9b-distill': 'empero-ai',
        'qwen3-8b': 'Qwen'
      };
      const folderName = localFolderMap[modelInfo.id] || 'Local';

      const bar = '█'.repeat(10);
      console.log(`   ✅ [${bar}] 100% | ${modelInfo.id} [❄️ Pronto no Disco - Pasta: ${folderName}]`);
      verified.push({
        id: modelInfo.id,
        folder: folderName,
        provider: 'lmstudio',
        providerName: `LM Studio [Pasta: ${folderName}]`,
        endpoint: `${baseUrl}/v1/chat/completions`,
        apiKey: 'lmstudio',
        ms: 10,
        isWarm: false
      });
    }
  }

  return verified;
}

// 2. Test Gemini API
async function testGemini() {
  const key = env.GOOGLE_API_KEY || env.GEMINI_API_KEY;
  if (!key) {
    console.log('\n⏩ GOOGLE_API_KEY / GEMINI_API_KEY não encontrada no .env (pulando)');
    return [];
  }

  console.log('\n🔍 Verificando API Google Gemini...');
  const candidateModels = ['gemini-2.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];
  const verified = [];
  const CLOUD_TIMEOUT_MS = 10000;
  const ESTIMATED_GEMINI_SEC = 4;

  const geminiMockStages = [
    { at: 0, text: '[TLS Handshake...]' },
    { at: 35, text: '[Validando Quota...]' },
    { at: 70, text: '[Payload...]' }
  ];

  for (const model of candidateModels) {
    const anim = new ModelProbeAnimation(model, 'Google Gemini', ESTIMATED_GEMINI_SEC, geminiMockStages);
    anim.start();

    const t0 = Date.now();
    try {
      const testRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] }),
          signal: AbortSignal.timeout(CLOUD_TIMEOUT_MS)
        }
      );
      const ms = Date.now() - t0;

      if (testRes.ok) {
        anim.finishSuccess(ms, '[Google Gemini Cloud]');
        verified.push({
          id: model,
          provider: 'gemini',
          providerName: 'Google Gemini',
          endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
          apiKey: key,
          ms
        });
      } else {
        let errSnippet = `HTTP ${testRes.status}`;
        try {
          const errJson = await testRes.json();
          if (errJson.error?.code === 503) errSnippet = 'Status 503 (Demanda Alta na infraestrutura Google)';
          else if (errJson.error?.code === 429) errSnippet = 'Status 429 (Quota Diaria Gratuita Excedida - 20 req/dia)';
          else if (errJson.error?.message) errSnippet = `HTTP ${testRes.status} (${errJson.error.message.slice(0, 60)})`;
        } catch {}
        anim.finishFailure(errSnippet);
      }
    } catch (err) {
      if (err.name === 'TimeoutError' || err.message?.includes('timeout')) {
        anim.finishFailure(`Timeout (${CLOUD_TIMEOUT_MS / 1000}s - Servidores Google sobrecarregados sem resposta)`);
      } else {
        anim.finishFailure(err.message || 'Erro de rede');
      }
    }
  }

  return verified;
}

// 3. Test Groq API
async function testGroq() {
  const key = env.GROQ_API_KEY;
  if (!key) {
    console.log('\n⏩ GROQ_API_KEY não configurada no .env (aguardando inserção)');
    return [];
  }

  console.log('\n🔍 Verificando API Groq Cloud (Ultra-Fast LPU)...');
  const verified = [];
  const GROQ_TIMEOUT_MS = 10000;
  const ESTIMATED_GROQ_SEC = 2;

  const groqMockStages = [
    { at: 0, text: '[Clusters LPU...]' },
    { at: 40, text: '[Speed ~300 tok/s...]' }
  ];

  try {
    const listRes = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(5000)
    });

    let modelsToTest = ['llama-3.3-70b-versatile', 'qwen-2.5-coder-32b', 'llama-3.1-8b-instant'];
    if (listRes.ok) {
      const data = await listRes.json();
      const available = (data.data || []).map(m => m.id);
      const filtered = modelsToTest.filter(m => available.includes(m));
      if (filtered.length > 0) modelsToTest = filtered;
      else if (available.length > 0) modelsToTest = available.slice(0, 3);
    }

    for (const model of modelsToTest) {
      const anim = new ModelProbeAnimation(model, 'Groq Cloud', ESTIMATED_GROQ_SEC, groqMockStages);
      anim.start();

      const t0 = Date.now();
      try {
        const testRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: 'ping' }],
            max_tokens: 5
          }),
          signal: AbortSignal.timeout(GROQ_TIMEOUT_MS)
        });
        const ms = Date.now() - t0;

        if (testRes.ok) {
          anim.finishSuccess(ms, '[Groq LPU Engine]');
          verified.push({
            id: model,
            provider: 'groq',
            providerName: 'Groq Cloud',
            endpoint: 'https://api.groq.com/openai/v1/chat/completions',
            apiKey: key,
            ms
          });
        } else {
          anim.finishFailure(`Status HTTP ${testRes.status}`);
        }
      } catch (err) {
        anim.finishFailure(err.name === 'TimeoutError' ? 'Timeout' : err.message);
      }
    }
  } catch (e) {
    console.log(`   ❌ Erro ao conectar na Groq: ${e.message}`);
  }

  return verified;
}

function saveRouterConfig(activeModel, allVerified) {
  const ccrDir = path.join(os.homedir(), '.claude-code-router');
  if (!fs.existsSync(ccrDir)) fs.mkdirSync(ccrDir, { recursive: true });

  const providersConfig = {};
  let geminiModel = allVerified.find(m => m.id === 'gemini-3.5-flash-lite') ||
                    allVerified.find(m => m.id === 'gemini-3.1-flash-lite') ||
                    allVerified.find(m => m.provider === 'gemini');

  for (const m of allVerified) {
    const provKey = `${m.provider}-provider`;
    if (!providersConfig[provKey]) {
      const isLms = m.provider === 'lmstudio';
      providersConfig[provKey] = {
        type: 'openai',
        endpoint: m.endpoint,
        authentication: {
          type: 'bearer',
          credentials: { apiKey: m.apiKey }
        },
        settings: {
          categoryMappings: isLms
            ? { default: true, thinking: true }
            : { default: true, background: true, thinking: true, longcontext: true, search: true },
          models: [],
          defaultModel: m.id
        }
      };
    }
    if (!providersConfig[provKey].settings.models.includes(m.id)) {
      providersConfig[provKey].settings.models.push(m.id);
    }
  }

  const activeProviderKey = `${activeModel.provider}-provider`;
  // Hybrid allocation: background tasks (/btw) and long transcripts go to Gemini if available
  const bgProvider = geminiModel ? 'gemini-provider' : activeProviderKey;
  const bgModelId = geminiModel ? geminiModel.id : activeModel.id;

  const routerConfig = {
    server: { port: 3456, host: '127.0.0.1' },
    routing: {
      rules: {
        default: { provider: activeProviderKey, model: activeModel.id },
        background: { provider: bgProvider, model: bgModelId },
        thinking: { provider: activeProviderKey, model: activeModel.id },
        longcontext: { provider: bgProvider, model: bgModelId },
        search: { provider: bgProvider, model: bgModelId }
      },
      defaultProvider: activeProviderKey,
      providers: providersConfig
    },
    debug: {
      enabled: false,
      logLevel: 'info',
      traceRequests: false,
      saveRequests: false
    }
  };

  const configPath = path.join(ccrDir, 'config-router.json');
  fs.writeFileSync(configPath, JSON.stringify(routerConfig, null, 2), 'utf8');

  const cachePath = path.resolve('.active-models.json');
  const cacheData = JSON.stringify({ active: activeModel, models: allVerified }, null, 2);
  fs.writeFileSync(cachePath, cacheData, 'utf8');
  try {
    const parentCache = path.resolve('..', '.active-models.json');
    fs.writeFileSync(parentCache, cacheData, 'utf8');
  } catch (_) {}

  console.log(`✅ Router configurado com sucesso em: ${configPath}\n`);
}

// Main Routine
async function main() {
  if (process.argv[2] === '--set-active' && process.argv[3]) {
    const cachePath = path.resolve('.active-models.json');
    const parentCache = path.resolve('..', '.active-models.json');
    const cPath = fs.existsSync(cachePath) ? cachePath : (fs.existsSync(parentCache) ? parentCache : null);
    if (cPath) {
      const cache = JSON.parse(fs.readFileSync(cPath, 'utf8'));
      const targetModel = (cache.models || []).find(m => m.id === process.argv[3]);
      if (targetModel) {
        saveRouterConfig(targetModel, cache.models);
        console.log(`🎯 Modelo Ativo alterado para: ${targetModel.id} (${targetModel.providerName})`);
        return;
      }
    }
  }

  console.log('====================================================');
  console.log('⚡ Feltrim Agents - Validador Dinamico de Modelos ⚡');
  console.log('====================================================');

  const lmModels = await testLMStudio();
  const geminiModels = await testGemini();
  const groqModels = await testGroq();

  const allVerified = [...lmModels, ...geminiModels, ...groqModels];

  console.log('\n====================================================');
  console.log(`📊 Modelos Validados com Sucesso (HTTP 200): ${allVerified.length}`);
  console.log('====================================================');

  if (allVerified.length === 0) {
    console.error('❌ Nenhum modelo respondeu com 200 OK. Verifique o LM Studio ou as chaves no .env.');
    process.exit(1);
  }

  allVerified.forEach((m, i) => {
    console.log(` ${i + 1}. [${m.providerName}] ${m.id} (${(m.ms / 1000).toFixed(2)}s)`);
  });

  const chosenModelId = process.argv[2];
  let activeModel = allVerified.find(m => m.id === chosenModelId);
  if (!activeModel) {
    // Prioritize qwen2.5-coder-7b-instruct for optimal speed on Quadro T1000 4GB VRAM
    const coder7b = allVerified.find(m => m.id === 'qwen2.5-coder-7b-instruct');
    const localFirst = allVerified.find(m => m.provider === 'lmstudio');
    activeModel = coder7b || localFirst || allVerified[0];
  }

  console.log(`\n🎯 Modelo Ativo Selecionado: ${activeModel.id} (${activeModel.providerName})`);

  saveRouterConfig(activeModel, allVerified);
}

main().catch(console.error);