# legacy/gherkin-manager-fase1/

> Snapshot integral da **fase 1 do projeto Gherkin Manager** incluindo
> proposta executiva, laudo de qualidade V4, atas, evidencias e
> relatorios de agentes. **CONTEM FLAG WORDS** (Volkswagen, Equifax,
> Santander).

## Origem

`<gherkin-manager-source>/`

Path local original (read-only, **nao apagar**):
`C:\Users\RafaelFeltrim\Desktop\Four\Gherkin-Manager_Fase1_Pacote\`

## Atencao

Este snapshot **CONTEM FLAG WORDS** listadas em
`governance/SECURITY_AND_PRIVACY.md`:

- Volkswagen (referenciada como `01_WOLKSVAGEN-CMS` no Laudo V4)
- Equifax (referenciada como `01_EQUIFAX-EBV` no Laudo V4)
- Santander (referenciada como `01_SANTANDER-SHI` no Laudo V4)

A presenca destas palavras e **aceitavel** apenas dentro de
`legacy/gherkin-manager-fase1/` conforme matriz da politica de
seguranca.

**NUNCA mover este conteudo para `core/`, `governance/`, `examples/`,
`packs/cms-gherkin/` ou raiz do repo sem sanitizacao explicita.**

## Conteudo

Raiz:

- `00_LEIA_ME_Apresentacao.md`
- `Proposta_Final_Substituicao_Copilot.md`
- `Relatorio_Benchmark_APIs.md`
- `Relatorio_Visao_Executiva.md`

`01_Documentos_Oficiais/` (7 docs):

- `01_Proposta_Final_Substituicao_Copilot.md`
- `02_Relatorio_Benchmark_APIs.md`
- `03_Relatorio_Visao_Executiva.md`
- `04_Relatorio_Auditoria_360.md` **[flag words]**
- `05_Laudo_Final_Qualidade_V4.md` **[flag words]**
- `06_Ata_Governanca_Qualidade.md` **[flag words]**
- `07_Evidencia_Padronizacao_Massiva.md` **[flag words]**

`blueprint_v3_documentacao/`:

- Coberto por `legacy/ff-v3-blueprint/` - nao duplicar referencia aqui.

`Relatorios_Agentes/` (14 relatorios):

- `relatorio_*.md` para cada um dos 14 papeis do FF

## O que foi extraido para destinos ativos

| Arquivo de origem | Destino | Sanitizacao |
|-------------------|---------|-------------|
| `Proposta_Final_Substituicao_Copilot.md` | `packs/us-avaliator/docs/Proposta_Substituicao_Copilot.md` | R$, nomes, equipe redigidos |
| `Relatorios_Agentes/*.md` (14) | `packs/us-avaliator/agent-reports/*.md` | nomes redigidos |
| `blueprint_v3_documentacao/protocols/*.md` (8) | `core/protocols/*.md` | sem mudanca |
| `blueprint_v3_documentacao/docs/OPERATING_MODEL.md` | `core/docs/OPERATING_MODEL.md` | sem mudanca |

## O que NAO foi extraido (decisao explicita)

| Arquivo de origem | Motivo |
|-------------------|--------|
| `01_Documentos_Oficiais/04_Relatorio_Auditoria_360.md` | Contem 3 nomes de clientes (flag words). Decidir profundidade da sanitizacao em revisao posterior. |
| `01_Documentos_Oficiais/05_Laudo_Final_Qualidade_V4.md` | Idem. |
| `01_Documentos_Oficiais/06_Ata_Governanca_Qualidade.md` | Idem. |
| `01_Documentos_Oficiais/07_Evidencia_Padronizacao_Massiva.md` | Idem. |

Ver `DECISIONS_PENDING.md` item 1 para opcoes.

## Status

- **Read-only.**
- Preservado para consulta historica e potencial promocao via decisao
  futura.
- Nao referenciado por boot sequence nem por packs ativos.

## Veja tambem

- `packs/us-avaliator/` (subset sanitizado deste snapshot)
- `legacy/ff-v3-blueprint/` (subset tecnico deste snapshot)
- `governance/SECURITY_AND_PRIVACY.md`
- `DECISIONS_PENDING.md` item 1
