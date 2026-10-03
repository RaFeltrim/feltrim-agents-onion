# CLAUDE.md - Feltrim Agents Base (pointer)

Este e o ponto de entrada minimo para Claude Code neste repositorio.

O boot sequence real, hierarquia de agentes, sistema de memoria e regras
operacionais estao em:

- `core/CLAUDE.md` - boot sequence canonico
- `core/docs/SQUAD_INDEX.md` - roster completo, triggers e niveis
- `core/memory/MEMORY.md` - indice de memoria persistente
- `governance/COMPANY_CHARTER.md` - identidade da empresa

## Boot rapido

1. Ler `core/CLAUDE.md`.
2. Ler `.agents/rules/00-project.md` (Princípio do Contexto Mínimo Suficiente).
3. Ler `core/memory/MEMORY.md` e carregar arquivos indexados.
4. Glob `core/agents/*.md` e contar gens disponiveis.
5. Ler `core/docs/SQUAD_INDEX.md` para entender quem invocar quando.
6. Verificar se algum pack esta ativo (existe pasta em `packs/<nome>/` com
   `agents/` populado) e, se sim, ler `packs/<nome>/README.md`.

## Governança Multi-IDE & Pesquisa Acadêmica
- Regras canônicas de orquestração: `.agents/rules/` (`00-project`, `10-architecture`, `20-quality`, `30-security`, `40-git`).
- Pesquisa acadêmica e benchmarks: `docs/deep-research/` (Guia Artificial Analysis 2026 e Boas Práticas Scratch / Antigravity 2.0).

## Packs disponiveis

- `packs/cvp-sias-qa/` - QA Mainframe x Web, Azure DevOps/Test Plans
- `packs/cms-gherkin/` - BDD/Gherkin com prompts por modelo LLM
- `packs/us-avaliator/` - Studio QA, substituicao Copilot Pro
- `packs/_template-pack/` - esqueleto para novos packs

## Protocolo de Auto-Validação de Modelo e Raciocínio

- **Auto-Validação Obrigatória**: Antes de iniciar o raciocínio em qualquer questão, valide internamente o modelo ativo configurado para esta sessão (`qwen2.5-coder-7b-instruct`, `qwen3.8-9b-distill`, `gemini-3.5-flash-lite`, `gemini-2.5-flash`).
- **Arquitetura & Limites**:
  - **Qwen Local (LM Studio / Quadro T1000)**: Raciocínio focado, respostas concisas e código direto. Limite de contexto estrito de 48.000 tokens (48k). Não gere paredes de texto desnecessárias.
  - **Gemini Cloud (Google API)**: Janela massiva de 1M tokens, excelente para análise ampla de repositório, cruzamento de arquivos e auditoria global.
- **Identidade Declarada**: NUNCA afirme ser Claude Opus ou Claude Sonnet da Anthropic. Se perguntado sobre qual modelo está em uso ou sua data de corte, declare o nome exato do modelo selecionado e seu provedor ativo.

## Aviso

`legacy/` NAO e fonte ativa. NAO carregue prompts nem brains de `legacy/` no
boot. So consulte se precisar de contexto historico.

