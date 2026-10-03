const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getEnvConfig() {
  const envPath = path.resolve('.env');
  const config = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
      if (match && !match[1].startsWith('#')) {
        config[match[1]] = match[2] ? match[2].trim() : '';
      }
    }
  }
  return config;
}

const env = getEnvConfig();

async function main() {
  console.log('====================================================');
  console.log('⚡ Feltrim Agents - Pipeline de Compressão de Contexto ⚡');
  console.log('====================================================\n');

  // 1. Graphify Pipeline
  console.log('📊 1. Executando indexação semântica e AST com Graphify...');
  try {
    if (!fs.existsSync('graphify-out/graph.json')) {
      console.log('   🛠️ Extraindo nós e arestas do repositório...');
      execSync('python -m graphify extract . --code-only', { stdio: 'inherit' });
      execSync('python -m graphify cluster-only .', { stdio: 'inherit' });
    } else {
      console.log('   ✅ Grafo existente detectado em graphify-out/ (reutilizando).');
    }
  } catch (err) {
    console.log('   ⚠️ Graphify warning:', err.message);
  }

  // 2. Coletando insumos para o Gemini
  console.log('\n🧠 2. Coletando dados de contexto e histórico...');
  let graphReport = '';
  if (fs.existsSync('graphify-out/GRAPH_REPORT.md')) {
    graphReport = fs.readFileSync('graphify-out/GRAPH_REPORT.md', 'utf8');
  }

  let decisions = '';
  if (fs.existsSync('DECISIONS_PENDING.md')) {
    decisions = fs.readFileSync('DECISIONS_PENDING.md', 'utf8');
  }

  // Listar packs ativos
  let packs = [];
  if (fs.existsSync('packs')) {
    packs = fs.readdirSync('packs').filter(f => fs.statSync(path.join('packs', f)).isDirectory());
  }

  const promptInput = `
Você é o Context Compressor do ecossistema Feltrim Agents.
Sua missão: sintetizar um Briefing Operacional Estruturado e Ultra-Compacto (< 400 palavras) sobre o repositório.
Este briefing será injetado diretamente no modelo local (Qwen 7B/9B) para que ele entenda o projeto sem gastar memória VRAM/RAM.

Dados do Projeto:
- Packs instalados: ${packs.join(', ')}
- Resumo do Grafo de Código (Graphify):
${graphReport.slice(0, 1500)}

- Histórico de Decisões do Projeto:
${decisions.slice(0, 1500)}

Regras da Resposta:
1. Formato em Markdown direto e conciso (estilo Executive Summary / Caveman denso).
2. Destaque: Arquitetura Core, Packs Disponíveis, Regras de QA/Código e Estado Atual.
3. Não use introduções formais. Comece direto em "# Briefing Operacional de Contexto".
`;

  // 3. Chamando Gemini para compactação
  const apiKey = env.GOOGLE_API_KEY || env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ Erro: GOOGLE_API_KEY ou GEMINI_API_KEY não encontrada no .env');
    process.exit(1);
  }

  const geminiModel = 'gemini-3.5-flash-lite';
  console.log(`📡 3. Enviando para Google Gemini (${geminiModel} - 1M Context Window)...`);
  const t0 = Date.now();

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: geminiModel,
        messages: [{ role: 'user', content: promptInput }],
        max_tokens: 800,
        temperature: 0.2
      })
    });

    const elapsed = ((Date.now() - t0) / 1000).toFixed(2);
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`❌ Falha na compressão do Gemini (Status ${res.status}):`, errBody);
      process.exit(1);
    }

    const data = await res.json();
    const briefContent = data.choices?.[0]?.message?.content || '';

    // 4. Salvar briefing compactado
    const outDir = path.resolve('.claude');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    
    const targetFile = path.join(outDir, 'context-brief.md');
    fs.writeFileSync(targetFile, briefContent, 'utf8');

    console.log(`\n✅ 4. Briefing compactado gerado com sucesso em ${elapsed}s!`);
    console.log(`📁 Arquivo salvo em: ${targetFile}`);
    console.log(`📏 Tamanho do briefing: ~${Math.round(briefContent.length / 4)} tokens (Economia de 90%!)`);
    console.log('\n--- PRÉVIA DO BRIEFING GERADO ---');
    console.log(briefContent.split('\n').slice(0, 15).join('\n'));
    console.log('...\n---------------------------------');
    console.log('🎯 Agora os modelos locais (Qwen) podem consumir esse contexto leve sem estourar o limite de VRAM!');
  } catch (err) {
    console.error('❌ Exceção ao chamar Gemini:', err.message);
  }
}

main();
