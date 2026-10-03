# legacy/

> Snapshots de origens historicas do Feltrim Agents Framework. **NUNCA**
> usar como prompt ativo - estes diretorios sao apenas para preservar
> provenance e permitir consulta a versoes anteriores.

## Politica

Por `governance/SECURITY_AND_PRIVACY.md`, esta pasta:

- **PODE** conter mencoes a clientes, marketplaces, equipes e versoes
  obsoletas (cada subpasta tem sua propria janela do que e aceitavel -
  ver READMEs).
- **NAO PODE** ser referenciada por `core/` nem pelos packs ativos
  (`packs/cvp-sias-qa`, `packs/cms-gherkin`, `packs/us-avaliator`).
- Boot sequence (`CLAUDE.md`, `AGENTS.md`, `core/CLAUDE.md`) NUNCA cita
  `legacy/`.
- Pull requests que tentem mover conteudo de `legacy/` para `core/` ou
  para packs ativos DEVEM passar por sanitizacao explicita.

## Formato dos snapshots

Cada subpasta tem:

- `README.md` - **fonte autoritativa**. Explica origem, conteudo,
  versao, status, motivo da preservacao, o que foi extraido para `core/`
  ou packs, e o que NAO foi extraido (com motivo).
- Eventualmente um `MANIFEST.md` ou `IP_PENDENTE.md` com listas
  detalhadas.
- **Os arquivos originais permanecem em seus paths locais de origem**
  conforme guardrail do projeto ("nao editar nem apagar origens"). A
  pasta `legacy/` deste repositorio nao duplica o conteudo - apenas
  preserva provenance.

## Subpastas

| Subpasta | Origem | Status |
|----------|--------|--------|
| `ff-v1/` | `Four/US-Avaliator-CMS 1/.../FF/` | Snapshot (templates + manifestos v1) |
| `ff-v3-blueprint/` | `Four/Gherkin-Manager_Fase1_Pacote/blueprint_v3_documentacao/` | Snapshot integral v3 |
| `gherkin-manager-fase1/` | `Four/Gherkin-Manager_Fase1_Pacote/` | Snapshot com flag words (Volkswagen/Equifax/Santander) |
| `gems-external/` | `Four/gems/` | IP pendente (catalogo terceiros) |
| `feltrim-agents-base-v2/` | `Desktop/feltrim-agents-base/feltrim-agents-base/` | Snapshot v2 com marketplaces (Tiny/ML/Magalu/Shopee) |

## Como contribuir

Para promover algo de `legacy/` para `core/` ou pack ativo:

1. Identificar o arquivo de origem em `legacy/<source>/README.md`.
2. Verificar palavras-bandeira (`governance/SECURITY_AND_PRIVACY.md`).
3. Sanitizar conforme a politica do destino (core: agressivo; pack:
   manter contexto do projeto).
4. Adicionar header de origem `<!-- origem: legacy/... sanitizada em ... -->`.
5. Abrir PR com diff explicito.

## Veja tambem

- `governance/SECURITY_AND_PRIVACY.md` (matriz do que e aceitavel onde)
- `DECISIONS_PENDING.md` (decisoes em aberto sobre legacy)
