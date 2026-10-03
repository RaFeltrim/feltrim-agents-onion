const { execSync, spawn } = require('child_process');

class LmsModelAnimation {
  constructor(modelName, estimatedSec = 16) {
    this.modelName = modelName;
    this.estimatedSec = estimatedSec;
    this.startTime = Date.now();
    this.progress = 5;
    this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.frameIdx = 0;
    this.timer = null;
    this.stages = [
      { at: 0, text: '[Ejetando VRAM anterior...]' },
      { at: 20, text: '[Alocando VRAM na Quadro T1000...]' },
      { at: 45, text: '[Carregando pesos GGUF na GPU...]' },
      { at: 75, text: '[Configurando Contexto 48k...]' }
    ];
  }

  getCurrentStage() {
    let t = '';
    for (const s of this.stages) {
      if (this.progress >= s.at) t = s.text;
    }
    return t;
  }

  start() {
    this.timer = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000;
      const target = Math.min(88, Math.floor((elapsed / this.estimatedSec) * 80) + 10);
      if (this.progress < target) this.progress += 1;

      const cols = process.stdout.columns || 80;
      const frame = this.frames[this.frameIdx++ % this.frames.length];
      const filled = Math.floor(this.progress / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
      const remaining = Math.max(1, Math.round(this.estimatedSec - elapsed));
      const stageText = this.getCurrentStage();

      let line = `   ${frame} [${bar}] ${this.progress}% | Carregando ${this.modelName} (~${remaining}s) ${stageText}`;
      if (line.length >= cols - 1) line = line.substring(0, cols - 2);
      process.stdout.write(`\r\x1b[K${line}`);
    }, 80);
  }

  finishSuccess(realMs) {
    if (this.timer) clearInterval(this.timer);
    const cols = process.stdout.columns || 80;
    const bar = '█'.repeat(10);
    const sec = (realMs / 1000).toFixed(2);
    let line = `   ✅ [${bar}] 100% | ${this.modelName} Carregado na VRAM em ${sec}s [Pronto na GPU]`;
    if (line.length >= cols - 1) line = line.substring(0, cols - 2);
    process.stdout.write(`\r\x1b[K${line}\n`);
  }

  finishFailure(msg) {
    if (this.timer) clearInterval(this.timer);
    const cols = process.stdout.columns || 80;
    let line = `   ❌ [${this.modelName}] Falha no carregamento: ${msg}`;
    if (line.length >= cols - 1) line = line.substring(0, cols - 2);
    process.stdout.write(`\r\x1b[K${line}\n`);
  }
}

async function ensureModelLoaded(modelKey, contextLength = 32768, parallel = 1) {
  // 1. Garantir servidor ligado
  try {
    const status = execSync('lms status', { stdio: 'pipe' }).toString();
    if (status.includes('Server:  OFF') || status.includes('OFF')) {
      console.log('   🚀 Iniciando servidor LM Studio (porta 1234)...');
      execSync('lms server start', { stdio: 'pipe' });
    }
  } catch (_) {}

  // 2. Verificar se o modelo desejado ja esta carregado com o contexto correto
  try {
    const ps = execSync('lms ps', { stdio: 'pipe' }).toString();
    const hasModel = ps.includes(modelKey);
    const hasContext = ps.includes(String(contextLength));
    if (hasModel && hasContext) {
      console.log(`   🔥 Modelo local ${modelKey} já está carregado com contexto ${contextLength} (Parallel: ${parallel}) e pronto na memória!`);
      return true;
    }
  } catch (_) {}

  // 3. Ejetar modelos anteriores da VRAM/RAM
  const os = require('os');
  const freeGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
  console.log(`\n🧹 Verificando integridade de recursos (RAM livre: ${freeGB} GB)...`);
  console.log(`   Ejetando modelos anteriores do LM Studio para garantir exclusividade de VRAM...`);
  try {
    execSync('lms unload --all', { stdio: 'pipe' });
    console.log(`   ✅ VRAM liberada.`);
  } catch (e) {
    console.log(`   ℹ️ Nenhum modelo para ejetar.`);
  }
  await new Promise(r => setTimeout(r, 800));

  // 4. Carregar o novo modelo com barra de progresso animada e limite calibrado
  console.log(`🚀 Carregando ${modelKey} na VRAM (Contexto: ${contextLength} tokens, Parallel: ${parallel} slot(s))...`);
  const anim = new LmsModelAnimation(modelKey, 16);
  anim.start();

  const t0 = Date.now();
  try {
    // --parallel controla slots de KV cache em RAM/VRAM
    execSync(`lms load ${modelKey} -y --gpu max --context-length ${contextLength} --parallel ${parallel}`, {
      stdio: 'pipe',
      timeout: 90000
    });
    const ms = Date.now() - t0;
    anim.finishSuccess(ms);
    return true;
  } catch (err) {
    anim.finishFailure(err.message || 'Timeout/Erro ao carregar');
    return false;
  }
}

// Se chamado diretamente via CLI: node lms-manager.js <modelKey> [contextLength] [parallel]
if (require.main === module) {
  const modelKey = process.argv[2];
  const ctx = process.argv[3] ? parseInt(process.argv[3], 10) : 32768;
  const parallel = process.argv[4] ? parseInt(process.argv[4], 10) : 1;
  if (!modelKey) {
    console.log('Uso: node lms-manager.js <modelKey> [contextLength] [parallel]');
    process.exit(1);
  }
  ensureModelLoaded(modelKey, ctx, parallel).then(ok => process.exit(ok ? 0 : 1));
}

module.exports = { ensureModelLoaded };
