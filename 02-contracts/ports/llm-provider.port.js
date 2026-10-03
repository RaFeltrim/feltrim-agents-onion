/**
 * LLM Provider Port (Interface)
 * Todo adaptador de modelo (LM Studio, Gemini, Groq, Ollama) DEVE implementar esta interface.
 */
class LLMProviderPort {
  /**
   * @param {string} modelId
   * @param {Array<{role: string, content: string}>} messages
   * @param {object} options
   * @returns {Promise<{content: string, usage: object, model: string}>}
   */
  async generateCompletion(modelId, messages, options = {}) {
    throw new Error('Method generateCompletion() must be implemented.');
  }

  /**
   * @param {string} modelId
   * @param {Array<{role: string, content: string}>} messages
   * @param {object} options
   * @returns {AsyncGenerator<{event: string, data: any}>}
   */
  async *streamCompletion(modelId, messages, options = {}) {
    throw new Error('Method streamCompletion() must be implemented.');
  }

  /**
   * @param {string} modelId
   * @returns {Promise<{isHealthy: boolean, latencyMs: number, reason?: string}>}
   */
  async checkHealth(modelId) {
    throw new Error('Method checkHealth() must be implemented.');
  }
}

module.exports = { LLMProviderPort };
