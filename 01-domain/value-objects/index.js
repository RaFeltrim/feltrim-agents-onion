/**
 * Value Objects do Domínio Feltrim Agents
 * Imutáveis e desacoplados de qualquer framework externo.
 */

const ActivationMode = Object.freeze({
  SOLO: 'SOLO',
  PAIRED: 'PAIRED',
  MINI_SQUAD: 'MINI_SQUAD',
  FULL_SQUAD: 'FULL_SQUAD'
});

const AgentLevel = Object.freeze({
  N1: 'N1', // Iniciante / Específico de Pack
  N2: 'N2', // Especialista Júnior / Operacional
  N3: 'N3', // Especialista Pleno / Core Developer
  N4: 'N4', // Tech Lead / Arquiteto
  N5: 'N5'  // CIAO / Gate Executivo
});

const ModelCategory = Object.freeze({
  DEFAULT: 'default',
  THINKING: 'thinking',
  BACKGROUND: 'background',
  LONG_CONTEXT: 'longcontext',
  SEARCH: 'search'
});

module.exports = {
  ActivationMode,
  AgentLevel,
  ModelCategory
};
