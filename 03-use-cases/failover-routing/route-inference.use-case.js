/**
 * Caso de Uso: Roteamento de Inferência com Auto-Failover Preditivo
 * Decide o melhor provedor (Local vs Cloud) baseado na volumetria de tokens e integridade.
 */

class RouteInferenceUseCase {
  constructor(localProvider, cloudProvider, options = {}) {
    this.localProvider = localProvider;
    this.cloudProvider = cloudProvider;
    this.tokenThreshold = options.tokenThreshold || 20000;
  }

  estimateTokens(messages) {
    const text = messages.map(m => m.content || '').join(' ');
    return Math.ceil(text.length / 4);
  }

  async execute(request) {
    const tokens = this.estimateTokens(request.messages || []);
    
    // Regra Preditiva: Transcrições longas (>20k) vão para o Cloud Provider para poupar VRAM local
    if (tokens > this.tokenThreshold) {
      return {
        targetProvider: 'cloud',
        provider: this.cloudProvider,
        category: 'longcontext',
        reason: 'Volumetria > 20k tokens (1M Cloud Context)'
      };
    }

    // Tenta provedor local prioritário
    try {
      const health = await this.localProvider.checkHealth(request.model);
      if (health.isHealthy) {
        return {
          targetProvider: 'local',
          provider: this.localProvider,
          category: 'default',
          reason: 'Local VRAM inference online'
        };
      }
    } catch (_) {}

    // Fallback transparente para o Cloud Provider
    return {
      targetProvider: 'cloud',
      provider: this.cloudProvider,
      category: 'failover',
      reason: 'Local inference indisponível ou falhou (Auto-Failover ativado)'
    };
  }
}

module.exports = { RouteInferenceUseCase };
