const { LLMProviderPort } = require('../../02-contracts/ports/llm-provider.port');

class GeminiCloudAdapter extends LLMProviderPort {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
  }

  async checkHealth(modelId) {
    const t0 = Date.now();
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'ping' }] }] }),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        return { isHealthy: true, latencyMs: Date.now() - t0 };
      }
      return { isHealthy: false, latencyMs: Date.now() - t0, reason: `HTTP ${res.status}` };
    } catch (e) {
      return { isHealthy: false, latencyMs: Date.now() - t0, reason: e.message };
    }
  }

  async generateCompletion(modelId, messages, options = {}) {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.apiKey
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature: options.temperature || 0.2,
        max_tokens: options.maxTokens || 8192
      })
    });
    if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
    const data = await res.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage || {},
      model: modelId
    };
  }
}

module.exports = { GeminiCloudAdapter };
