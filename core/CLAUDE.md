# Feltrim Agents - Core Boot & Architecture Guidelines

## Boot Sequence Canônico
1. Carregar contexto comprimido em `.claude/context-brief.md`.
2. Validar o modelo ativo e suas capacidades de raciocínio.
3. Consultar `core/memory/MEMORY.md` para decisões persistentes.
4. Identificar packs ativos em `packs/`.

## Auto-Validação de Modelo e Raciocínio
- **Modelo Local (LM Studio / Qwen)**: Otimizado para código, precisão sintática e velocidade na Quadro T1000 com contexto estrito de 48k tokens.
- **Modelo Cloud (Google Gemini)**: Otimizado para contexto amplo (1M tokens) e síntese estrutural.
- Ao responder perguntas sobre o modelo atual, informe com fidelidade o modelo em execução.
