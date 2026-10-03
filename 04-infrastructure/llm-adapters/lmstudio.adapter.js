const { LLMProviderPort } = require('../../02-contracts/ports/llm-provider.port');

class LMStudioAdapter extends LLMProviderPort {
  constructor(baseUrl = 'http://127.0.0.1:1234') {
    super();
    this.baseUrl = baseUrl;
  }

  async checkHealth(modelId) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        return { isHealthy: true, latencyMs: Date.now() - t0 };
      }
      return { isHealthy: false, latencyMs: Date.now() - t0, reason: `HTTP ${res.status}` };
    } catch (e) {
      return { isHealthy: false, latencyMs: Date.now() - t0, reason: e.message };
    }
  }

  async generateCompletion(modelId, messages, options = {}) {
    const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature: options.temperature || 0.2,
        max_tokens: options.maxTokens || 4096
      })
    });
    if (!res.ok) throw new Error(`LM Studio error ${res.status}`);
    const data = await res.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage || {},
      model: modelId
    };
  }
}

module.exports = { LMStudioAdapter };
