# Integração: LM Studio (Local Inference)

## Propósito

Permitir que agentes do Feltrim Framework usem modelos LLM locais via
LM Studio como alternativa gratuita aos provedores cloud. Ideal para
tarefas SOLO e PAR de baixa criticidade conforme
`core/docs/TOKEN_ECONOMY.md`.

## Pré-requisitos

- LM Studio >= 0.4.1 instalado e funcional.
- Modelo GGUF carregado e servido via server mode.
- Recomendado: Qwen 3 8B distill (Q4_K_M) para hardware com 4-8GB VRAM.
- GPU com suporte CUDA ou Vulkan para offload de camadas.

## Variáveis de ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `LMSTUDIO_BASE_URL` | `http://127.0.0.1:1234` | URL do server LM Studio |
| `LMSTUDIO_DEFAULT_MODEL` | `qwen3-8b` | Nome/alias do modelo carregado |
| `LMSTUDIO_CONTEXT_LENGTH` | `32768` | Janela de contexto (**mínimo 32k** — Claude Code usa ~23k de system prompt) |

Ao usar via Claude Code CLI, mapear:

| Variável Claude Code | Valor | Propósito |
|----------------------|-------|-----------|
| `ANTHROPIC_BASE_URL` | `= $LMSTUDIO_BASE_URL` | Redireciona API calls |
| `ANTHROPIC_API_KEY` | `lmstudio` | Placeholder (LM Studio ignora) |
| `CLAUDE_CODE_ATTRIBUTION_HEADER` | `0` | Evita invalidação de KV cache |

## Como o agente invoca

Via Claude Code CLI com redirect de API:

```powershell
# Direto
$env:ANTHROPIC_BASE_URL = "http://127.0.0.1:1234"
$env:ANTHROPIC_API_KEY = "lmstudio"
claude --model qwen3-8b

# Via script do framework
.\core\scripts\start-claude-multi.ps1 -Provider LMStudio -Project "C:\meu-projeto" -Model "qwen3-8b"
```

Ou via Antigravity IDE: configurar nas settings do workspace o endpoint
local como provider OpenAI-compatible.

## Overhead do Claude Code

> ⚠️ **DESCOBERTA REAL (teste Out/2026):** O Claude Code envia **~23.292
> tokens** de system prompt + tool definitions antes de qualquer mensagem
> do usuário. Isso significa que o modelo precisa de **pelo menos 32k
> tokens de contexto** apenas para iniciar. Com 8k, retorna erro 400.

## Modelos recomendados por hardware

| GPU VRAM | Modelo recomendado | Quantização | Contexto mín | Observação |
|----------|-------------------|-------------|-------------|------------|
| 4GB | Qwen 2.5 Coder 7B / Qwen 3 8B | Q3_K_S / Q4_K_M | 32k (com offload CPU) | ~1-3 tok/s, uso básico |
| 8GB | Qwen 3 8B / 3.5 9B | Q4_K_M / Q5_K_M | 32k nativo | ~5-10 tok/s, funcional |
| 12GB+ | Qwen 3.5 14B+ | Q4_K_M | 32k-64k | ~10-20 tok/s, confortável |

## Limites

- **Context window** limitado pelo hardware (GPU VRAM + RAM para KV cache).
- **Tool calling** pode ser instável com modelos < 13B parâmetros.
- **Extended thinking** não disponível (feature exclusiva Claude).
- **Prompt caching** não funcional (feature server-side Anthropic).
- **Velocidade**: ~1-5 tok/s em GPU 4GB VRAM com offload RAM; ~10-20
  tok/s em GPU 8GB+.

## Quando usar vs quando NÃO usar

### Usar (local)

- Tarefas SOLO: copy, refactor, typo, documentação.
- Tarefas PAR simples: bug fix + reteste, spike técnico curto.
- Prototipagem rápida sem custo de API.
- Offline / sem internet.

### NÃO usar (preferir cloud)

- Tarefas MINI-SQUAD / FULL TEAM (contexto insuficiente).
- Tool calling complexo multi-turn (modelo local perde coerência).
- Go-Live review (Sofia CIAO precisa de modelo premium).
- Quando qualidade do output é crítica (compliance, auditoria).

## Falhar graciosamente

Se LM Studio estiver offline ou modelo não carregado:

1. Claude Code CLI vai timeout na conexão (~30s).
2. Script `start-claude-multi.ps1` verifica health antes de lançar.
3. Fallback manual: usar `-Provider Gemini` ou cloud.

```powershell
# Fallback para cloud (requer API key)
$env:ANTHROPIC_BASE_URL = "https://api.anthropic.com"
$env:ANTHROPIC_API_KEY = "<sua-api-key-real>"
claude
```

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `Connection refused` | LM Studio server desligado | Ligar server na aba Developer |
| `Model not found` | Modelo não carregado | Carregar modelo no LM Studio |
| OOM / crash | VRAM insuficiente | Reduzir context length ou usar quantização menor |
| Respostas incoerentes | Modelo pequeno demais | Usar Q4_K_M mínimo; evitar IQ2/IQ1 |
| Tool calling falha | Modelo sem treino de tool use | Usar Qwen 3+ (tem tool calling nativo) |

---
Créditos: Rafael Feltrim.
Todo o conteúdo deste arquivo no projeto foi estruturado e produzido por Rafael Feltrim.
