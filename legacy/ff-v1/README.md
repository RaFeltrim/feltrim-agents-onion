# legacy/ff-v1/

> Snapshot do **Feltrim's Framework V1** (versao manifesto + templates
> parametrizados + instancia "us-avaliator").

## Origem

`<ff-v1-source>/_feltrims_framework_docs/`

Path local original (read-only, **nao apagar**):
`C:\Users\RafaelFeltrim\Desktop\Four\US-Avaliator-CMS 1\US-Avaliator-CMS\FF\_feltrims_framework_docs\`

## Versao

FF v1.0 - epoca: Marco/2026.

## Conteudo do snapshot

Manifestos (4 arquivos):

- `FELTRIMS_FRAMEWORK.md` - manifesto principal do framework
- `FELTRIMS_IDE_VISION.md` - visao IDE Antigravity
- `estrategia-uso-maximo-potencial-IAs.md` - estrategia de uso de LLMs
- `KNOWLEDGE_BASE.md` - template de KB por projeto

Templates parametrizados (`_ff_template/`):

- `INDEX.md`, `SETUP.md` - guias de criacao de novo projeto
- `CIAO/CIAO/gem_ciao_c_level.md`
- `DB/DADOS/gem_dba_rules.md`, `DB/DE/gem_data_eng_sr.md`
- `DEVs/ARCH/gem_arch_sr.md`, `BACKEND/gem_backend_ssr.md`,
  `DEVOPS/gem_devops_sr.md`, `FRONTEND/gem_frontend_ssr.md`,
  `MOBILE/gem_mobile_sr.md`, `PROMPT/gem_prompt_eng.md`,
  `QA/gem_gherkin_architect.md`, `QA/gem_qa_sdet_sr.md`,
  `TL/gem_tech_lead_sr.md`, `UIUX/gem_ui_ux_sr.md`
- `GP/PM/gem_project_manager_sr.md`, `GP/PO/gem_product_owner_sr.md`

Instancia "us-avaliator" (`blueprint/`):

- 14 gens instanciadas com nomes reais (Aline, Beatriz, Camila, Claudia,
  Cleber, Emerson, Fabio, Joao, Laura, Mariana, Marlon, Pedro, Rafael,
  Sofia).

Outros (`docs/`):

- `ff_reuniao_relatorial.md` - registro de reuniao.

## O que foi extraido para destinos ativos

| Arquivo de origem | Destino |
|-------------------|---------|
| `FELTRIMS_FRAMEWORK.md` | `core/docs/manifesto/FELTRIMS_FRAMEWORK_MANIFESTO.md` |
| `FELTRIMS_IDE_VISION.md` | `core/docs/manifesto/FELTRIMS_IDE_VISION.md` |
| `estrategia-uso-maximo-potencial-IAs.md` | `core/docs/strategy/USO-MAXIMO-IAs.md` |
| `KNOWLEDGE_BASE.md` | `core/docs/templates/KNOWLEDGE_BASE_TEMPLATE.md` |
| `_ff_template/SETUP.md` | `core/agents/_template/SETUP_TEMPLATE.md` |
| `_ff_template/INDEX.md` | `core/agents/_template/INDEX_TEMPLATE.md` |
| `_ff_template/.../gem_*.md` (12 esqueletos) | inspiracao para `core/agents/_template/gem-skeleton.md` |

## O que NAO foi extraido

| Arquivo de origem | Motivo |
|-------------------|--------|
| `blueprint/*/gem_*.md` (14 instancias com nomes reais) | Sao instancia, nao template - `core/agents/` ja tem 15 gens canonicas |
| `docs/ff_reuniao_relatorial.md` | Registro pontual - nao acionavel |

## Palavras-bandeira

- Nomes proprios de pessoas reais (Aline, Beatriz, etc.) - aceitavel em
  `legacy/` por se tratar de snapshot historico.
- Nao contem clientes, marketplaces ou segredos.

## Status

- **Read-only.**
- Nao referenciado por boot sequence.
- Preservado para consulta historica e auditoria de evolucao do FF.

## Veja tambem

- `core/docs/manifesto/` (versao ativa)
- `core/agents/_template/` (versao ativa)
- `legacy/ff-v3-blueprint/README.md` (versao v3, sucessora)
