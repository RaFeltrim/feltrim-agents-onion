const assert = require('assert');
const fs = require('fs');
const path = require('path');

function runTests() {
  console.log('🧪 Executando Bateria de Testes do Pack: Mvp Starter...');
  
  // Teste 1: Existência de contratos
  assert.strictEqual(fs.existsSync(path.join(__dirname, '../contracts/OPERATING_CONTRACT.md')), true, 'Contrato operacional deve existir');
  
  // Teste 2: Existência dos 3 agentes
  assert.strictEqual(fs.existsSync(path.join(__dirname, '../agents/gem_mvp-starter_orchestrator.md')), true, 'Orquestrador deve existir');
  assert.strictEqual(fs.existsSync(path.join(__dirname, '../agents/gem_mvp-starter_developer.md')), true, 'Developer deve existir');
  assert.strictEqual(fs.existsSync(path.join(__dirname, '../agents/gem_mvp-starter_qa.md')), true, 'QA deve existir');

  console.log('✅ [PASS] Todos os 2 testes do Pack Mvp Starter foram aprovados com sucesso!');
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
