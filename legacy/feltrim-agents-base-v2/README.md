# legacy/feltrim-agents-base-v2/

> Snapshot do **Feltrim Agents Base V2** (versao predecessora deste
> rebrand). **CONTEM FLAG WORDS** de marketplaces (Tiny ERP, ML, Magalu,
> Shopee, prefixos SKU, DFS/ANATEL).

## Origem

`<feltrim-agents-base>/`

Path local original (read-only, **nao apagar**):
`C:\Users\RafaelFeltrim\Desktop\feltrim-agents-base\feltrim-agents-base\`

## Versao

Feltrim Agents Base V2 (anterior ao rebrand de 2026-05).

## Atencao

Este snapshot **CONTEM FLAG WORDS** listadas em
`governance/SECURITY_AND_PRIVACY.md`:

- `Tiny ERP`, `Tiny`
- `Mercado Livre`, `ML`
- `Magalu`, `Shopee`
- Prefixos SKU especificos (`DF-`, `MM-`, `UNIV-`, `M87B`, `LNTRN18LDS`)
- Regras `DFS_BLOCKED`, `DFS_OK`, `ANATEL`, `MIV/SNL/UVZ`

A presenca destas palavras e **aceitavel** apenas dentro de
`legacy/feltrim-agents-base-v2/`. Quando o pack opcional
`packs/feltrim-internal/` for criado (decisao pendente, ver
`DECISIONS_PENDING.md` item 3), elas tambem serao aceitas la.

## Conteudo

- `CLAUDE.md` (master original com boot sequence, marketplaces,
  marcadores DFS/ANATEL, regras operacionais especificas do Rafael)
- `MEMORY.md`
- `agents/` (22 gems originais, incluindo as 7 CVP/SIAS - das quais 15
  genericas e 7 CVP/SIAS foram migradas; resto ficou aqui)
- `memory/agents/<slug>/brain.md` (13 brains - sanitizados e migrados)
- `memory/agents/_templates/` (3 templates - migrados)
- `memory/team-rituals/` (11 rituais - migrados)
- `docs/` (`ARQUITETURA.md` com marketplaces, `SQUAD_INDEX.md` v2,
  `ONBOARDING.md`, `CVP_SIAS_QA_PACK.md`)
- `integrations/` (`openclaw`, `n8n`, `obsidian`, `pixel-agents` -
  esqueletos)
- `scripts/` (`bootstrap.sh`, `post-stop.js`)

## O que foi extraido para destinos ativos

| Arquivo de origem | Destino | Sanitizacao |
|-------------------|---------|-------------|
| `agents/gem_*.md` (15 genericas) | `core/agents/gem_*.md` | marketplaces, Tiny, ML, Shopee, M87B, DFS, ANATEL removidos |
| `agents/gem_cvp_sias_*.md` (7) | `packs/cvp-sias-qa/agents/` | 1:1 |
| `memory/agents/<slug>/brain.md` (10 genericos) | `core/memory/agents/<slug>/brain.md` | CVP/SIAS, marketplaces removidos |
| `memory/agents/cvp-sias-*/brain.md` (7) | `packs/cvp-sias-qa/brains/cvp-sias-*/brain.md` | 1:1 |
| `memory/agents/_templates/*.md` | `core/memory/agents/_templates/` | 1:1 |
| `memory/team-rituals/*.md` | `core/memory/team-rituals/` | mencoes a CVP/SIAS removidas |
| `docs/CVP_SIAS_QA_PACK.md` | `packs/cvp-sias-qa/docs/` | paths absolutos -> placeholders |
| `MEMORY.md` | input para `core/memory/MEMORY.md` | reescrito generico |

## O que NAO foi extraido (decisao explicita)

| Arquivo de origem | Motivo |
|-------------------|--------|
| `CLAUDE.md` original | Contem marketplaces especificos da empresa Rafael. Aguarda decisao sobre pack `feltrim-internal` (ver `DECISIONS_PENDING.md` item 3). |
| `docs/ARQUITETURA.md` original (com marketplaces) | Idem. `core/docs/ARQUITETURA.md` foi reescrito generico. |
| `agents/<extras>` (gens nao usadas) | Resolvido individualmente conforme decisao 3. |
| `integrations/*` | Resolvido individualmente conforme decisao 5. |

## Decisoes pendentes

- `DECISIONS_PENDING.md` item 3 (pack `feltrim-internal` opcional).
- `DECISIONS_PENDING.md` item 5 (split `integrations/` core vs pack).
- `DECISIONS_PENDING.md` item 8 (regras DFS/ANATEL/prefixos SKU).

## Status

- **Read-only.**
- Preservado para consulta historica.
- Quando decisao 3 for tomada, conteudo restante migra para
  `packs/feltrim-internal/` ou permanece neste snapshot definitivamente.

## Veja tambem

- `core/` (versao ativa apos sanitizacao)
- `packs/cvp-sias-qa/` (extracao especifica)
- `DECISIONS_PENDING.md` itens 3, 5, 8
- `governance/SECURITY_AND_PRIVACY.md`
