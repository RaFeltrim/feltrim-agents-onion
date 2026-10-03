# OpenAI Codex & Universal CLI Instructions

Este arquivo orienta ferramentas baseadas em OpenAI Codex, OpenCode ou CLIs universais que operam neste repositório.

## Diretrizes Canônicas
1. **Contrato Central**: Consulte sempre o [AGENTS.md](../AGENTS.md) e [CLAUDE.md](../CLAUDE.md) para o boot sequence e lista de packs.
2. **Regras de Engenharia**: As regras canônicas residem em:
   - [.agents/rules/00-project.md](../.agents/rules/00-project.md) (Contexto Mínimo Suficiente)
   - [.agents/rules/10-architecture.md](../.agents/rules/10-architecture.md) (Onion Architecture & Concorrência)
   - [.agents/rules/20-quality.md](../.agents/rules/20-quality.md) (Qualidade Artificial Analysis & SDET)
   - [.agents/rules/30-security.md](../.agents/rules/30-security.md) (Menor Privilégio & Zero-Secrets)
   - [.agents/rules/40-git.md](../.agents/rules/40-git.md) (Uma Tarefa, Uma Branch)
3. **Auditoria**: Nunca marque uma tarefa como finalizada sem rodar `cmd.exe /c test-onion.cmd`.
