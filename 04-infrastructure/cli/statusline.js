#!/usr/bin/env node
const fs = require('fs');

/**
 * Feltrim Agents - Claude Code StatusLine Telemetry
 * Renderiza no rodapé do Claude Code o consumo de contexto em tempo real,
 * a porcentagem consumida, barra visual e alerta de compactação (/compact).
 */
function main() {
  try {
    const input = fs.readFileSync(0, 'utf8');
    if (!input || !input.trim()) return;

    const data = JSON.parse(input);
    const ctx = data.context_window || {};

    const modelId = (data.model?.id || data.model?.display_name || process.env.ANTHROPIC_MODEL || '').toLowerCase();

    // 1. Limite Máximo de Contexto Real por Família de Modelo
    let maxTokens = ctx.context_window_size;
    if (modelId.includes('gemini')) {
      maxTokens = 1000000; // 1 Milhão de tokens para Gemini
    } else if (modelId.includes('qwen') || modelId.includes('deepseek')) {
      maxTokens = parseInt(process.env.CLAUDE_CODE_MAX_CONTEXT_TOKENS || '32768', 10);
    } else if (!maxTokens || maxTokens <= 0) {
      maxTokens = 200000;
    }

    // 2. Porcentagem Utilizada e Tokens Atuais
    let usedPct = (typeof ctx.used_percentage === 'number' && ctx.used_percentage > 0)
      ? Math.round(ctx.used_percentage)
      : null;

    let currentTokens = ctx.current_usage || ctx.total_input_tokens || data.cost?.total_input_tokens;
    if (typeof currentTokens !== 'number' || currentTokens === 0) {
      if (usedPct !== null && usedPct > 0) {
        currentTokens = Math.round((usedPct / 100) * maxTokens);
      } else {
        // Carga base padrão do system prompt do Claude Code (~23.4k tokens)
        currentTokens = 23900;
      }
    }

    if (usedPct === null && maxTokens > 0) {
      usedPct = Math.min(100, Math.round((currentTokens / maxTokens) * 100));
    }
    if (usedPct === null) usedPct = 0;

    // Formatação de grandezas (ex: 14.5k ou 1.0M)
    const formatTokens = (n) => {
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000) return (n / 1024).toFixed(1) + 'k';
      return String(n);
    };

    const currentStr = formatTokens(currentTokens);
    const maxStr = formatTokens(maxTokens);

    // 4. Cores e Alerta de Compactação (Limiar aos 80%)
    let color = '\x1b[32m'; // Verde (< 60%)
    let compactAlert = '';

    if (usedPct >= 80) {
      color = '\x1b[31;1m'; // Vermelho brilhante
      compactAlert = ' \x1b[33;1m(⚠️ /compact)\x1b[0m';
    } else if (usedPct >= 60) {
      color = '\x1b[33m'; // Amarelo
    }

    // 5. Barra de progresso visual de 6 segmentos
    const totalBars = 6;
    const filledBars = Math.min(totalBars, Math.max(0, Math.round((usedPct / 100) * totalBars)));
    const bar = '█'.repeat(filledBars) + '░'.repeat(totalBars - filledBars);

    // 6. Saída estilizada para o rodapé
    const output = `\x1b[90m[\x1b[0m🧠 \x1b[1mContexto:\x1b[0m ${currentStr}/${maxStr} ${color}${usedPct}%\x1b[0m \x1b[90m${bar}\x1b[0m${compactAlert}\x1b[90m]\x1b[0m`;

    process.stdout.write(output);
  } catch (_) {
    // Resiliência total: em caso de payload inesperado, não quebra a interface
  }
}

main();
