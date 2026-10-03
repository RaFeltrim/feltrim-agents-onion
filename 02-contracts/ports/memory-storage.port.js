/**
 * Memory Storage Port (Interface)
 * Abstrai onde a memória dos agentes vive (Markdown, JSON, Supabase, etc.).
 */
class MemoryStoragePort {
  /**
   * @param {string} agentSlug
   * @returns {Promise<string>}
   */
  async readBrain(agentSlug) {
    throw new Error('Method readBrain() must be implemented.');
  }

  /**
   * @param {string} agentSlug
   * @param {string} content
   * @returns {Promise<void>}
   */
  async appendBrain(agentSlug, content) {
    throw new Error('Method appendBrain() must be implemented.');
  }
}

module.exports = { MemoryStoragePort };
