#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * ==============================================================================
 * 📦 FELTRIM AGENTS ONION - MVP PACK SCAFFOLDING GENERATOR
 * ==============================================================================
 * Gera a estrutura completa e canônica de um novo Pack Modular (MVP)
 * dentro da Arquitetura de Cebola, reaproveitando 100% da infraestrutura,
 * governança e suíte de testes.
 * ==============================================================================
 */

function sanitizeSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toTitleCase(str) {
  return str
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function createMvpPack(rawName, description = '') {
  if (!rawName) {
    console.error('❌ Erro: Informe o nome do novo MVP.');
    console.log('Uso: node create-pack.js <nome-do-mvp> [descricao]');
    console.log('Ex:  node create-pack.js marketplace-mvp "MVP de Integracao com Marketplaces"');
    process.exit(1);
  }

  const slug = sanitizeSlug(rawName);
  const title = toTitleCase(slug);
  const desc = description || `MVP especializado em ${title}, operando sobre o Feltrim Agents Framework.`;

  const projectRoot = path.resolve(__dirname, '../..');
  const packsDir = path.join(projectRoot, 'packs');
  const targetDir = path.join(packsDir, slug);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Erro: O Pack 'packs/${slug}' já existe! Escolha outro nome.`);
    process.exit(1);
  }

  console.log(`\n🚀 Criando Novo Pack Modular: ${title} [packs/${slug}]...`);

  // Diretórios do Pack
  const dirs = [
    targetDir,
    path.join(targetDir, 'agents'),
    path.join(targetDir, 'brains', `${slug}-orchestrator`),
    path.join(targetDir, 'brains', `${slug}-developer`),
    path.join(targetDir, 'brains', `${slug}-qa`),
    path.join(targetDir, 'contracts'),
    path.join(targetDir, 'docs'),
    path.join(targetDir, 'tests')
  ];

  for (const d of dirs) {
    fs.mkdirSync(d, { recursive: true });
  }

  // 1. README.md do Pack
  const readmeContent = `# Pack: ${title}

> ${desc}
> Integrado à Arquitetura de Cebola (*feltrim-agents-onion*).

## Estrutura do Pack

\`\`\`
packs/${slug}/
├── README.md                                  (Este documento)
├── agents/
│   ├── gem_${slug}_orchestrator.md            (N4 - Orquestrador do Produto)
│   ├── gem_${slug}_developer.md               (N3 - Especialista de Implementação)
│   └── gem_${slug}_qa.md                      (N3 - Auditor de Qualidade e Regras)
├── brains/
│   ├── ${slug}-orchestrator/brain.md          (Memória de longo prazo do Orquestrador)
│   ├── ${slug}-developer/brain.md             (Memória técnica de implementação)
│   └── ${slug}-qa/brain.md                    (Memória de cenários de teste e auditorias)
├── contracts/
│   ├── OPERATING_CONTRACT.md                  (Regras e invariantes não-negociáveis)
│   └── API_IO_SCHEMA.md                       (Contratos de entrada, saída e eventos)
├── docs/
│   ├── ARCHITECTURE.md                        (Visão arquitetural e fluxo de dados)
│   └── CAPABILITY_MATRIX.md                   (Matriz de capacidades e certificações)
└── tests/
    └── ${slug}_test_suite.js                  (Bateria de testes automatizados do MVP)
\`\`\`

## Como Ativar este Pack no Claude Code

\`\`\`powershell
# Inicie o Claude Code conectado ao ecossistema:
.\\start-onion.cmd

# Carregue no prompt:
# "Ativar pack packs/${slug}/README.md e assumir papel de gem_${slug}_orchestrator"
\`\`\`
`;
  fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent, 'utf8');

  // 2. Agents
  const orchAgent = `# Gem: ${title} Orchestrator

- **ID:** \`gem_${slug}_orchestrator\`
- **Nível:** N4 (Orquestrador de Domínio)
- **Papel:** Liderança técnica e direcionamento estratégico do MVP ${title}.
- **Escopo:** Decompor objetivos, acionar o Developer e o QA, garantir cumprimento da constituição do projeto.
- **Invariante:** Nunca avança sem validação do QA e evidência de testes.
`;
  fs.writeFileSync(path.join(targetDir, 'agents', `gem_${slug}_orchestrator.md`), orchAgent, 'utf8');

  const devAgent = `# Gem: ${title} Developer

- **ID:** \`gem_${slug}_developer\`
- **Nível:** N3 (Implementador Especialista)
- **Papel:** Implementação das regras de negócio, use-cases e adaptadores técnicos do MVP ${title}.
- **Escopo:** Escrever código limpo seguindo Domain-Driven Design (DDD) e Clean Architecture.
- **Invariante:** Código sem testes unitários é considerado incompleto (WIP).
`;
  fs.writeFileSync(path.join(targetDir, 'agents', `gem_${slug}_developer.md`), devAgent, 'utf8');

  const qaAgent = `# Gem: ${title} QA & Validator

- **ID:** \`gem_${slug}_qa\`
- **Nível:** N3 (Auditor de Qualidade)
- **Papel:** Garantir conformidade com os contratos, matriz de cobertura e testes de regressão.
- **Escopo:** "Rafael QA pensa em cenários de falha antes de cenários de sucesso."
- **Invariante:** Emite laudo com evidência reproduzível para cada entrega.
`;
  fs.writeFileSync(path.join(targetDir, 'agents', `gem_${slug}_qa.md`), qaAgent, 'utf8');

  // 3. Brains (Memórias Persistentes)
  const brainContent = (role) => `# Brain: ${title} ${role}

> Memória persistente de aprendizados, decisões e lições aprendidas no MVP ${title}.

## 1. Contexto do Produto
- **Produto:** ${title}
- **Status:** MVP em Desenvolvimento
- **Papel do Agente:** ${role}

## 2. Decisões Consolidadas
- [${new Date().toISOString().slice(0, 10)}] Inicialização oficial da estrutura modular do MVP via scaffolding.

## 3. Aprendizados e Gotchas
- *(Registrar aqui lições aprendidas durante as sprints)*
`;
  fs.writeFileSync(path.join(targetDir, 'brains', `${slug}-orchestrator`, 'brain.md'), brainContent('Orchestrator'), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'brains', `${slug}-developer`, 'brain.md'), brainContent('Developer'), 'utf8');
  fs.writeFileSync(path.join(targetDir, 'brains', `${slug}-qa`, 'brain.md'), brainContent('QA Validator'), 'utf8');

  // 4. Contracts
  const opContract = `# Contrato Operacional: ${title}

## Invariantes Não-Negociáveis
1. **Isolamento de Domínio:** O domínio do ${title} reside estritamente neste pack.
2. **Reuso de Infraestrutura:** Comunicação com LLMs (LM Studio / Gemini) ocorre exclusivamente através do \`04-infrastructure/router\`.
3. **Decisor Humano:** Todas as entregas de MVP dependem de homologação final do decisor humano.
4. **Zero Segredos:** Nenhuma chave de API ou credencial deve ser persistida nos arquivos deste pack.
`;
  fs.writeFileSync(path.join(targetDir, 'contracts', 'OPERATING_CONTRACT.md'), opContract, 'utf8');

  const apiSchema = `# Contratos e Schemas de Entrada/Saída: ${title}

## 1. Comandos Principais
\`\`\`json
{
  "command": "init_${slug}",
  "version": "1.0.0",
  "payload": {
    "target": "string",
    "parameters": {}
  }
}
\`\`\`

## 2. Eventos de Saída
\`\`\`json
{
  "event": "${slug}_completed",
  "status": "SUCCESS",
  "timestamp": "ISO8601",
  "data": {}
}
\`\`\`
`;
  fs.writeFileSync(path.join(targetDir, 'contracts', 'API_IO_SCHEMA.md'), apiSchema, 'utf8');

  // 5. Docs
  const archDoc = `# Arquitetura do Produto: ${title}

\`\`\`mermaid
graph TD
    Client[Usuário / Cliente] --> Orch[gem_${slug}_orchestrator]
    Orch --> Dev[gem_${slug}_developer]
    Orch --> QA[gem_${slug}_qa]
    Dev --> Domain[Regras de Negócio do MVP]
    QA --> Tests[Suíte de Testes Automatizada]
\`\`\`
`;
  fs.writeFileSync(path.join(targetDir, 'docs', 'ARCHITECTURE.md'), archDoc, 'utf8');

  const capMatrix = `# Matriz de Capacidades: ${title}

| Agente | Nível | Responsabilidade Principal |
| :--- | :---: | :--- |
| \`gem_${slug}_orchestrator\` | N4 | Triagem e planejamento de entregas |
| \`gem_${slug}_developer\` | N3 | Codificação e use-cases |
| \`gem_${slug}_qa\` | N3 | Validação de invariantes e testes |
`;
  fs.writeFileSync(path.join(targetDir, 'docs', 'CAPABILITY_MATRIX.md'), capMatrix, 'utf8');

  // 6. Test Suite
  const testSuite = `const assert = require('assert');
const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('🧪 Executando Bateria de Testes do Pack: ${title}...');
  
  // Teste 1: Existência de contratos
  assert.strictEqual(fs.existsSync(path.join(__dirname, '../contracts/OPERATING_CONTRACT.md')), true, 'Contrato operacional deve existir');
  
  // Teste 2: Existência dos 3 agentes
  assert.strictEqual(fs.existsSync(path.join(__dirname, '../agents/gem_${slug}_orchestrator.md')), true, 'Orquestrador deve existir');
  assert.strictEqual(fs.existsSync(path.join(__dirname, '../agents/gem_${slug}_developer.md')), true, 'Developer deve existir');
  assert.strictEqual(fs.existsSync(path.join(__dirname, '../agents/gem_${slug}_qa.md')), true, 'QA deve existir');

  console.log('✅ [PASS] Todos os 2 testes do Pack ${title} foram aprovados com sucesso!');
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
`;
  fs.writeFileSync(path.join(targetDir, 'tests', `${slug}_test_suite.js`), testSuite, 'utf8');

  console.log(`\n🎉 Pack '${title}' criado com sucesso em: packs/${slug}`);
  console.log(`   - 3 Agentes especializados gerados (Orchestrator, Developer, QA)`);
  console.log(`   - 3 Brains de memória isolada criados`);
  console.log(`   - Contratos operacionais e API Schema definidos`);
  console.log(`   - Suíte de testes unitários integrada`);
  console.log(`\nPara testar a suíte do novo Pack:`);
  console.log(`   node packs/${slug}/tests/${slug}_test_suite.js\n`);
}

const args = process.argv.slice(2);
createMvpPack(args[0], args[1]);
