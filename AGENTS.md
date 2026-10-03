# AGENTS.md - Feltrim Agents Onion (Universal Multi-IDE Contract)

Contrato canônico universal para agentes operando em qualquer IDE ou CLI:
- **Google Antigravity**: `.agents/` e `.antigravity/`
- **Cursor**: `.cursor/rules/`
- **Claude Code**: `.claude/` e `CLAUDE.md`
- **OpenAI Codex / Universal**: `.codex/` e `AGENTS.md`

## Referências Canônicas de Boot
- `core/CLAUDE.md` - boot sequence canônico
- `core/docs/SQUAD_INDEX.md` - roster completo, triggers e níveis
- `core/memory/MEMORY.md` - índice de memória persistente
- `governance/COMPANY_CHARTER.md` - identidade e soberania humana

## Governança & Regras Operacionais (`.agents/rules/`)
- `00-project.md` - Escopo, Contexto Mínimo Suficiente e Anti-Circularidade
- `10-architecture.md` - Arquitetura Onion, Concorrência e Guardrail de 500ms
- `20-quality.md` - Padrão Artificial Analysis (Anti-Alucinação) e Aceite SDET
- `30-security.md` - Princípio do Menor Privilégio no MCP e Zero-Secrets
- `40-git.md` - "Uma Tarefa, Uma Branch" e Proteção da Main

## Pesquisa e Fundamentação Científica
- `docs/deep-research/` - Tratados acadêmicos sobre Artificial Analysis (2026) e Boas Práticas Scratch / Antigravity 2.0.

## Packs Ativos
- `packs/cvp-sias-qa/`
- `packs/cms-gherkin/`
- `packs/us-avaliator/`
- `packs/_template-pack/`

## Regra Estrita
Carregue apenas `core/` e packs ativos. `legacy/` é leitura sob demanda apenas para auditoria histórica. Validação obrigatória via `cmd.exe /c test-onion.cmd` antes de concluir qualquer tarefa.
