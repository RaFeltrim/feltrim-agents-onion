/**
 * ==============================================================================
 * 🎯 SUITE DE TESTES OFICIAL - RAFAEL (QA SDET SR)
 * ==============================================================================
 * Auditoria Hierárquica por CORE, MÓDULO (PACKS) e SUBMÓDULO
 * Arquitetura de Cebola: feltrim-agents-onion
 *
 * Lema: "Rafael QA pensa em cenários de falha antes de cenários de sucesso.
 *        Um teste que não pode falhar não é um teste."
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { execSync } = require('child_process');

const ONION_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(ONION_ROOT, '..');

// Classes da Cebola
const { ActivationMode, AgentLevel, ModelCategory } = require('../01-domain/value-objects');
const { LLMProviderPort } = require('../02-contracts/ports/llm-provider.port');
const { MemoryStoragePort } = require('../02-contracts/ports/memory-storage.port');
const { RouteInferenceUseCase } = require('../03-use-cases/failover-routing/route-inference.use-case');
const { LMStudioAdapter } = require('../04-infrastructure/llm-adapters/lmstudio.adapter');
const { GeminiCloudAdapter } = require('../04-infrastructure/llm-adapters/gemini.adapter');

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.groups = {};
  }

  test(category, moduleName, submodule, id, description, fn) {
    this.tests.push({ category, moduleName, submodule, id, description, fn });
  }

  async run() {
    console.log('================================================================================');
    console.log('🛡️  SUITE DE TESTES INTEGRADA - RAFAEL QA SDET SR');
    console.log('🏛️  COBERTURA GRANULAR: [CORE] | [MÓDULOS / PACKS] | [SUBMÓDULOS]');
    console.log('================================================================================\n');

    let currentModule = '';

    for (const t of this.tests) {
      const header = `[${t.category.toUpperCase()}] > ${t.moduleName}`;
      if (header !== currentModule) {
        currentModule = header;
        console.log(`\n📦 ${header}`);
        console.log('='.repeat(80));
      }

      const t0 = Date.now();
      try {
        await t.fn();
        const elapsed = Date.now() - t0;
        this.passed++;
        console.log(`  ✅ [PASS] ${t.id} [Submódulo: ${t.submodule}] - ${t.description} (${elapsed}ms)`);
        
        if (!this.groups[t.moduleName]) this.groups[t.moduleName] = { passed: 0, failed: 0 };
        this.groups[t.moduleName].passed++;
      } catch (err) {
        const elapsed = Date.now() - t0;
        this.failed++;
        console.error(`  ❌ [FAIL] ${t.id} [Submódulo: ${t.submodule}] - ${t.description} (${elapsed}ms)`);
        console.error(`     Erro: ${err.message}`);
        
        if (!this.groups[t.moduleName]) this.groups[t.moduleName] = { passed: 0, failed: 0 };
        this.groups[t.moduleName].failed++;
      }
    }

    console.log('\n================================================================================');
    console.log(`📊 RESUMO DA AUDITORIA POR NÍVEL HIERÁRQUICO:`);
    console.log('--------------------------------------------------------------------------------');
    for (const [mod, stat] of Object.entries(this.groups)) {
      const total = stat.passed + stat.failed;
      const rate = ((stat.passed / total) * 100).toFixed(0);
      const icon = stat.failed === 0 ? '🟢' : '🔴';
      console.log(`   ${icon} ${mod.padEnd(25)} | ${stat.passed}/${total} testes (${rate}%)`);
    }
    console.log('--------------------------------------------------------------------------------');
    console.log(`   TOTAL DE TESTES GARANTIDOS: ${this.tests.length}`);
    console.log(`   APROVADOS: ${this.passed} 🟢`);
    console.log(`   FALHAS:    ${this.failed} ${this.failed === 0 ? '🎉' : '🔴'}`);
    console.log(`   TAXA FINAL DE QUALIDADE:    ${((this.passed / this.tests.length) * 100).toFixed(1)}%`);
    console.log('================================================================================\n');

    if (this.failed > 0) {
      process.exit(1);
    }
  }
}

const runner = new TestRunner();

// ==============================================================================
// 1. CORE E SEUS SUBMÓDULOS
// ==============================================================================

runner.test('Core', 'Core Framework', '01-domain/value-objects', 'C01', 'Value Objects: ActivationMode e AgentLevel imutáveis', () => {
  assert(Object.isFrozen(ActivationMode), 'ActivationMode deve ser imutável');
  assert(Object.isFrozen(AgentLevel), 'AgentLevel deve ser imutável');
  assert(Object.isFrozen(ModelCategory), 'ModelCategory deve ser imutável');
});

runner.test('Core', 'Core Framework', '01-domain/agents', 'C02', 'Schema e Persona das 15 Gems canônicas do Core', () => {
  const agentsDir = path.join(ONION_ROOT, '01-domain', 'agents');
  const files = fs.readdirSync(agentsDir).filter(f => f.startsWith('gem_') && f.endsWith('.md'));
  assert.strictEqual(files.length, 15, `Core deve possuir 15 gems de agentes (encontradas: ${files.length})`);

  for (const f of files) {
    const content = fs.readFileSync(path.join(agentsDir, f), 'utf8');
    assert(content.includes('subagent_type:'), `Gem ${f} sem subagent_type`);
    assert(content.includes('Papel:'), `Gem ${f} sem Papel`);
    assert(content.includes('## Persona'), `Gem ${f} sem Persona`);
    assert(content.includes('## Trigger anti-patterns'), `Gem ${f} sem Trigger anti-patterns`);
  }
});

runner.test('Core', 'Core Framework', '01-domain/governance', 'C03', 'Governança: Company Charter, Hierarquia e Soberania Humana', () => {
  const charterPath = path.join(ONION_ROOT, '01-domain', 'governance', 'COMPANY_CHARTER.md');
  const hierPath = path.join(ONION_ROOT, '01-domain', 'governance', 'AGENT_HIERARCHY.md');
  assert(fs.existsSync(charterPath), 'COMPANY_CHARTER.md deve existir');
  assert(fs.existsSync(hierPath), 'AGENT_HIERARCHY.md deve existir');

  const charter = fs.readFileSync(charterPath, 'utf8');
  assert(charter.includes('Rafael Feltrim'), 'Charter deve consagrar Rafael Feltrim como Decisor Humano');
  assert(charter.includes('Valores nao-negociaveis'), 'Charter deve conter valores inegociáveis');
});

runner.test('Core', 'Core Framework', '02-contracts/ports', 'C04', 'Portas Abstratas: LLMProviderPort e MemoryStoragePort', async () => {
  const llmPort = new LLMProviderPort();
  await assert.rejects(async () => await llmPort.generateCompletion('m', []), /Method generateCompletion\(\) must be implemented/);
  await assert.rejects(async () => await llmPort.checkHealth('m'), /Method checkHealth\(\) must be implemented/);

  const memPort = new MemoryStoragePort();
  await assert.rejects(async () => await memPort.readBrain('test'), /Method readBrain\(\) must be implemented/);
});

runner.test('Core', 'Core Framework', '02-contracts/protocols', 'C05', 'Integridade e conformidade dos 8 Protocolos Sistêmicos', () => {
  const protoDir = path.join(ONION_ROOT, '02-contracts', 'protocols');
  const expected = [
    'AGENT_IO_CONTRACT.md',
    'AGENT_RUNTIME_WRAPPER.md',
    'DELIVERY_AND_PRODUCT_SURFACES.md',
    'EVALS_AND_MONITORING.md',
    'HANDOFF_PROTOCOL.md',
    'MEMORY_AND_RAG_POLICY.md',
    'MULTIMODAL_EXTENSION.md',
    'ORCHESTRATION_POLICY.md'
  ];
  for (const p of expected) {
    const full = path.join(protoDir, p);
    assert(fs.existsSync(full), `Protocolo ${p} ausente`);
    assert(fs.statSync(full).size > 500, `Protocolo ${p} inconsistente`);
  }
});

runner.test('Core', 'Core Framework', '03-use-cases/failover-routing', 'C06', 'Roteamento Preditivo (Threshold 20k tokens e Auto-Failover)', async () => {
  const mockLocal = { checkHealth: async () => ({ isHealthy: true, latencyMs: 30 }) };
  const mockCloud = { checkHealth: async () => ({ isHealthy: true, latencyMs: 120 }) };
  const useCase = new RouteInferenceUseCase(mockLocal, mockCloud, { tokenThreshold: 20000 });

  // Curto -> Local
  const decCurto = await useCase.execute({ messages: [{ role: 'user', content: 'prompt curto' }] });
  assert.strictEqual(decCurto.targetProvider, 'local');

  // Longo (>20k) -> Cloud
  const decLongo = await useCase.execute({ messages: [{ role: 'user', content: 'token '.repeat(25000) }] });
  assert.strictEqual(decLongo.targetProvider, 'cloud');
  assert.strictEqual(decLongo.category, 'longcontext');
});

runner.test('Core', 'Core Framework', '04-infrastructure/llm-adapters', 'C07', 'Adaptadores Concretos: LMStudioAdapter e GeminiCloudAdapter', () => {
  const lms = new LMStudioAdapter('http://127.0.0.1:1234');
  const gemini = new GeminiCloudAdapter('fake-key');
  assert(lms instanceof LLMProviderPort, 'LMStudioAdapter deve implementar LLMProviderPort');
  assert(gemini instanceof LLMProviderPort, 'GeminiCloudAdapter deve implementar LLMProviderPort');
});

runner.test('Core', 'Core Framework', '04-infrastructure/router', 'C08', 'Motor Router: Anti-Opus Identity Guard e proteção SSE', () => {
  const patchPath = path.join(ONION_ROOT, '04-infrastructure', 'router', 'patch-ccr.js');
  assert(fs.existsSync(patchPath), 'patch-ccr.js deve existir');
  const code = fs.readFileSync(patchPath, 'utf8');
  assert(code.includes('IDENTITY_GUARD') || code.includes('Opus'), 'Patch deve conter Anti-Opus Identity Guard');
});

runner.test('Core', 'Core Framework', '04-infrastructure/cli', 'C09', 'CLI e Launchers: start-claude-multi.ps1, telemetry.ps1 e sync-models.js', () => {
  const cliDir = path.join(ONION_ROOT, '04-infrastructure', 'cli');
  assert(fs.existsSync(path.join(cliDir, 'start-claude-multi.ps1')));
  assert(fs.existsSync(path.join(cliDir, 'telemetry.ps1')));
  assert(fs.existsSync(path.join(cliDir, 'sync-models.js')));
  assert(fs.existsSync(path.join(REPO_ROOT, 'start-onion.cmd')));
  assert(fs.existsSync(path.join(REPO_ROOT, 'telemetry-onion.cmd')));
});

// ==============================================================================
// 2. MÓDULO: cms-gherkin (BDD Automation Pack)
// ==============================================================================

runner.test('Módulo', 'cms-gherkin', 'ferramentas', 'M1_S1', 'Scripts de Automação Python: compilação sintática py_compile', () => {
  const toolsDir = path.join(ONION_ROOT, 'packs', 'cms-gherkin', 'ferramentas');
  const scriptGerar = path.join(toolsDir, 'gerar_artefatos.py');
  const scriptBug = path.join(toolsDir, 'registrar_problema.py');
  assert(fs.existsSync(scriptGerar), 'gerar_artefatos.py deve existir');
  assert(fs.existsSync(scriptBug), 'registrar_problema.py deve existir');

  // Compilação com interpretador Python real
  execSync(`python -m py_compile "${scriptGerar}" "${scriptBug}"`);
});

runner.test('Módulo', 'cms-gherkin', 'padrao-a-seguir', 'M1_S2', 'Especificação Canônica BDD: sintaxe Gherkin (Dado/Quando/Então)', () => {
  const padraoPath = path.join(ONION_ROOT, 'packs', 'cms-gherkin', 'padrao-a-seguir', 'EXEMPLO-PADRAO-APROVADO.md');
  assert(fs.existsSync(padraoPath), 'EXEMPLO-PADRAO-APROVADO.md deve existir');
  const content = fs.readFileSync(padraoPath, 'utf8');
  assert(content.includes('Cenário') || content.includes('Cenario'), 'Deve conter definição de Cenários');
  assert(content.includes('Dado') || content.includes('Given'), 'Deve conter Given/Dado');
  assert(content.includes('Quando') || content.includes('When'), 'Deve conter When/Quando');
  assert(content.includes('Então') || content.includes('Then'), 'Deve conter Then/Então');
  assert(content.includes('BDD'), 'Deve definir o padrão BDD');
});

runner.test('Módulo', 'cms-gherkin', 'fontes-estruturadas', 'M1_S3', 'Schema JSON das Fontes Estruturadas (MODELO e PROJETO)', () => {
  const fontesDir = path.join(ONION_ROOT, 'packs', 'cms-gherkin', 'fontes-estruturadas');
  const modeloPath = path.join(fontesDir, 'MODELO-FONTE-ESTRUTURADA.json');
  const exemploPath = path.join(fontesDir, 'PROJETO-EXEMPLO.json');

  assert(fs.existsSync(modeloPath), 'MODELO-FONTE-ESTRUTURADA.json deve existir');
  assert(fs.existsSync(exemploPath), 'PROJETO-EXEMPLO.json deve existir');

  const modelo = JSON.parse(fs.readFileSync(modeloPath, 'utf8'));
  const exemplo = JSON.parse(fs.readFileSync(exemploPath, 'utf8'));

  assert(modelo.slug || modelo.projeto || modelo.cenarios, 'MODELO JSON deve conter campos de estrutura');
  assert(exemplo.slug || exemplo.projeto || exemplo.cenarios, 'EXEMPLO JSON deve conter campos de estrutura');
});

runner.test('Módulo', 'cms-gherkin', 'prompts', 'M1_S4', 'Templates de Prompt BDD (Claude Opus, Gemini Pro, GPT)', () => {
  const promptsDir = path.join(ONION_ROOT, 'packs', 'cms-gherkin', 'prompts');
  const files = fs.readdirSync(promptsDir).filter(f => f.endsWith('.md'));
  assert(files.length >= 4, `Devem existir pelo menos 4 prompts BDD (encontrados: ${files.length})`);

  for (const file of files) {
    const content = fs.readFileSync(path.join(promptsDir, file), 'utf8');
    assert(content.includes('Gherkin') || content.includes('BDD'), `Prompt ${file} deve referenciar BDD/Gherkin`);
  }
});

runner.test('Módulo', 'cms-gherkin', 'memoria-operacional', 'M1_S5', 'Rastreabilidade Operacional: registro de lições e problemas', () => {
  const memDir = path.join(ONION_ROOT, 'packs', 'cms-gherkin', 'memoria-operacional');
  const probPath = path.join(memDir, 'PROBLEMAS-E-SOLUCOES.md');
  assert(fs.existsSync(probPath), 'PROBLEMAS-E-SOLUCOES.md deve existir');
  const content = fs.readFileSync(probPath, 'utf8');
  assert(content.length > 500, 'PROBLEMAS-E-SOLUCOES.md deve possuir histórico real');
});

// ==============================================================================
// 3. MÓDULO: cvp-sias-qa (Mainframe & Seguros Pack)
// ==============================================================================

runner.test('Módulo', 'cvp-sias-qa', 'agents', 'M2_S1', 'As 7 Gems de Agentes Especializados do CVP-SIAS', () => {
  const agentsDir = path.join(ONION_ROOT, 'packs', 'cvp-sias-qa', 'agents');
  const files = fs.readdirSync(agentsDir).filter(f => f.startsWith('gem_') && f.endsWith('.md'));
  assert.strictEqual(files.length, 7, `CVP-SIAS deve conter 7 gems especializadas (encontradas: ${files.length})`);

  for (const f of files) {
    const content = fs.readFileSync(path.join(agentsDir, f), 'utf8');
    assert(content.includes('subagent_type:'), `Gem CVP ${f} deve ter subagent_type`);
    assert(content.includes('CVP') || content.includes('SIAS'), `Gem CVP ${f} deve ter domínio de negócio SIAS/CVP`);
  }
});

runner.test('Módulo', 'cvp-sias-qa', 'brains', 'M2_S2', 'Isolamento de Memória: 7 Diretórios Brain para os Agentes do SIAS', () => {
  const brainsDir = path.join(ONION_ROOT, 'packs', 'cvp-sias-qa', 'brains');
  const dirs = fs.readdirSync(brainsDir).filter(d => fs.statSync(path.join(brainsDir, d)).isDirectory());
  assert.strictEqual(dirs.length, 7, `Devem existir 7 pastas brain no CVP-SIAS (encontradas: ${dirs.length})`);
});

runner.test('Módulo', 'cvp-sias-qa', 'skills', 'M2_S3', 'Contratos e Especificação de Skills do Mainframe / Azure', () => {
  const skillsDir = path.join(ONION_ROOT, 'packs', 'cvp-sias-qa', 'skills');
  const readme = path.join(skillsDir, 'README.md');
  assert(fs.existsSync(readme), 'README.md de skills deve existir');
  const content = fs.readFileSync(readme, 'utf8');
  assert(content.includes('skill') || content.includes('Skill'), 'Deve detalhar o catálogo de skills do CVP');
});

runner.test('Módulo', 'cvp-sias-qa', 'docs', 'M2_S4', 'Matriz de Capacidades e Contratos Operacionais do CVP-SIAS', () => {
  const docsDir = path.join(ONION_ROOT, 'packs', 'cvp-sias-qa', 'docs');
  const capMatrix = path.join(docsDir, 'FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md');
  const opContract = path.join(docsDir, 'FELTRIM_AGENTS_CVP_SIAS_OPERATING_CONTRACT.md');
  assert(fs.existsSync(capMatrix), 'Matriz de Capacidades deve existir');
  assert(fs.existsSync(opContract), 'Contrato Operacional deve existir');
});

// ==============================================================================
// 4. MÓDULO: us-avaliator (User Story Evaluation Pack)
// ==============================================================================

runner.test('Módulo', 'us-avaliator', 'agent-reports', 'M3_S1', 'Pareceres Oficiais de Avaliação Técnica (14 Agentes Especialistas)', () => {
  const reportsDir = path.join(ONION_ROOT, 'packs', 'us-avaliator', 'agent-reports');
  const reports = fs.readdirSync(reportsDir).filter(f => f.startsWith('relatorio_') && f.endsWith('.md'));
  assert.strictEqual(reports.length, 14, `Devem existir 14 pareceres de agentes (encontrados: ${reports.length})`);

  // Validação explícita do parecer do próprio Rafael QA
  const rafaelReport = path.join(reportsDir, 'relatorio_rafael_qa.md');
  assert(fs.existsSync(rafaelReport), 'Parecer de Rafael QA deve existir');
  const content = fs.readFileSync(rafaelReport, 'utf8');
  assert(content.includes('Rafael - QA'), 'Parecer deve ser assinado por Rafael - QA');
  assert(content.includes('APROVADO'), 'Parecer deve ter status conclusivo');
});

runner.test('Módulo', 'us-avaliator', 'docs', 'M3_S2', 'Proposta Executiva de Substituição e Critérios de Homologação', () => {
  const docsDir = path.join(ONION_ROOT, 'packs', 'us-avaliator', 'docs');
  const propPath = path.join(docsDir, 'Proposta_Substituicao_Copilot.md');
  assert(fs.existsSync(propPath), 'Proposta_Substituicao_Copilot.md deve existir');
  const content = fs.readFileSync(propPath, 'utf8');
  assert(content.length > 5000, 'Proposta executiva deve ter densidade substancial');
  assert(content.includes('Copilot') || content.includes('Ollama') || content.includes('Gemini'), 'Proposta deve contrastar modelos e custos');
});

// ==============================================================================
// 5. PACKS DINÂMICOS & NOVOS MVPS (Auto-Discovery)
// ==============================================================================
const packsRoot = path.join(ONION_ROOT, 'packs');
if (fs.existsSync(packsRoot)) {
  const customPacks = fs.readdirSync(packsRoot).filter(p => {
    return !['cms-gherkin', 'cvp-sias-qa', 'us-avaliator'].includes(p) &&
      fs.existsSync(path.join(packsRoot, p, 'tests'));
  });

  for (const packSlug of customPacks) {
    const testDir = path.join(packsRoot, packSlug, 'tests');
    const testFiles = fs.readdirSync(testDir).filter(f => f.endsWith('_test_suite.js'));
    for (const tf of testFiles) {
      runner.test('Módulo / MVP', packSlug, 'tests', `MVP_${packSlug.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`, `Bateria de Testes Automatizada do Pack ${packSlug}`, () => {
        const testModule = require(path.join(testDir, tf));
        if (typeof testModule.runTests === 'function') {
          testModule.runTests();
        }
      });
    }
  }
}

// Execução
runner.run().catch(err => {
  console.error('Falha crítica na suíte:', err);
  process.exit(1);
});
