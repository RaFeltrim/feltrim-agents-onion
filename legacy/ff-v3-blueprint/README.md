# legacy/ff-v3-blueprint/

> Snapshot do **Feltrim's Framework V3** com blueprint completo (8
> protocols + memoria + docs operacionais + gens v3).

## Origem

`<gherkin-manager-source>/blueprint_v3_documentacao/`

Path local original (read-only, **nao apagar**):
`C:\Users\RafaelFeltrim\Desktop\Four\Gherkin-Manager_Fase1_Pacote\blueprint_v3_documentacao\`

## Versao

FF v3.0 (com 8 protocolos formalizados).

## Conteudo do snapshot

Protocols (`protocols/`):

- `AGENT_IO_CONTRACT.md`
- `AGENT_RUNTIME_WRAPPER.md`
- `DELIVERY_AND_PRODUCT_SURFACES.md`
- `EVALS_AND_MONITORING.md`
- `HANDOFF_PROTOCOL.md`
- `MEMORY_AND_RAG_POLICY.md`
- `MULTIMODAL_EXTENSION.md`
- `ORCHESTRATION_POLICY.md`

Docs operacionais (`docs/`):

- `OPERATING_MODEL.md`
- `ARQUITETURA.md`
- `SQUAD_INDEX.md` (v3, versao anterior a 2.1)
- `ONBOARDING.md`
- Outros docs operacionais

Memory (`memory/`):

- `MEMORY.md` indice
- `agents/_templates/` (3 templates pre-dossie-13)
- `team-rituals/` (11 rituais)
- `agents/<slug>/brain.md` (13 brains)

Gens v3 (`agents/` ou estrutura derivada):

- 13 gens com formato v3 (com referencia explicita aos 8 protocolos)

Outros:

- `CHANGELOG_V3.md`
- `test_*.txt` (descartar)

## O que foi extraido para destinos ativos

| Arquivo de origem | Destino |
|-------------------|---------|
| `protocols/*.md` (8 arquivos) | `core/protocols/*.md` (1:1) |
| `docs/OPERATING_MODEL.md` | `core/docs/OPERATING_MODEL.md` (1:1) |
| `memory/agents/_templates/*.md` | input para `core/memory/agents/_templates/` |
| `memory/team-rituals/*.md` | input para `core/memory/team-rituals/` |
| `memory/MEMORY.md` | input para `core/memory/MEMORY.md` |
| `docs/ARQUITETURA.md` | input para `core/docs/ARQUITETURA.md` (revisado) |
| `docs/SQUAD_INDEX.md` | input para `core/docs/SQUAD_INDEX.md` v2.1 |
| `docs/ONBOARDING.md` | input para `core/docs/ONBOARDING.md` |

## O que NAO foi extraido

| Arquivo de origem | Motivo |
|-------------------|--------|
| `CHANGELOG_V3.md` | Historico - preservar so em legacy |
| `test_*.txt` | Test outputs antigos - descartar |
| Gens v3 instanciadas | `core/agents/` usa versao v2 sanitizada como base canonica |

## Palavras-bandeira

- Nao contem clientes nem marketplaces.
- Pode citar CVP/SIAS em comentarios de origem (aceitavel em legacy).

## Status

- **Read-only.**
- Snapshot de referencia para evolucao do FF (v1 -> v2 -> v3 -> core
  atual).
- Nao referenciado por boot sequence.

## Veja tambem

- `core/protocols/` (versao ativa)
- `core/docs/OPERATING_MODEL.md` (versao ativa)
- `legacy/ff-v1/README.md` (versao v1, predecessora)
