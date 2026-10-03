# Changelog - Pack CVP/SIAS QA

Historico consolidando o "Dossie de Atualizacao Feltrim Agents para
Repositorio Principal" (origem:
`<cvp-sias-repo>/analise-feltrim-agents-cvp/13-dossie-atualizacao-feltrim-agents-github.md`)
e o que foi efetivamente migrado para o boilerplate Feltrim Agents Base.

## 1.1.0 - 2026-05-16 - Pack consolidado no boilerplate Feltrim Agents Base

### Migrado

- **7 gens CVP/SIAS** (`agents/gem_cvp_sias_*.md`) copiadas integralmente do
  repositorio original `<feltrim-agents-base>/agents/`. Sem alteracao de
  conteudo, apenas cabecalho de origem adicionado.
- **7 brains CVP/SIAS** (`brains/cvp-sias-*/brain.md`) copiados de
  `<feltrim-agents-base>/memory/agents/cvp-sias-*/brain.md`. Sem alteracao.
- **4 docs operacionais** copiados e ajustados:
  - `CVP_SIAS_QA_PACK.md` (origem `<feltrim-agents-base>/docs/`)
  - `FELTRIM_AGENTS_CVP_SIAS.md` (origem `<cvp-sias-repo>/docs/`)
  - `FELTRIM_AGENTS_CVP_SIAS_OPERATING_CONTRACT.md` (origem `<cvp-sias-repo>/docs/`)
  - `FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md` (origem `<cvp-sias-repo>/docs/`)
- **Paths absolutos sanitizados**: `C:\Users\RafaelFeltrim\Desktop\...`
  substituido por placeholders relativos `<feltrim-agents-base>`,
  `<cvp-sias-repo>` ou `<ff-v1-source>`.

### Atualizacoes propostas pelo dossie 13 (incorporadas)

#### Atualizacao A - Agent Profile Padrao

- Template `agent-profile-template.md` criado em
  `core/memory/agents/_templates/agent-profile-template.md`. Aplicavel a
  qualquer gem (core ou pack).
- Template `agent-capability-review-template.md` criado em
  `core/memory/agents/_templates/agent-capability-review-template.md`.

#### Atualizacao B - Matriz de Niveis

- `core/docs/AGENT_LEVELS_AND_CERTIFICATIONS.md` define N1-N5 com mapeamento
  para gens core. CVP/SIAS QA Orchestrator: N4. Bug Retest / CT Execution /
  Dashboard Hub: N3. Evidence PDF / Azure Status: N2-N3. Playwright Runner: N2.

#### Atualizacao C - Certificacoes Internas

- `core/docs/AGENT_CERTIFICATIONS.md` traz o catalogo generico.
- Certificacoes especificas do pack CVP/SIAS estao listadas em
  `packs/cvp-sias-qa/README.md` e detalhadas em
  `FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md`.

#### Atualizacao D - Habilidades Desbloqueadas

- `core/docs/AGENT_UNLOCKS.md` traz unlocks genericos + lista referencial
  de unlocks especificos de pack:
  - `read-azure-ct-bug`
  - `compare-mainframe-web`
  - `generate-evidence-markdown`
  - `generate-evidence-pdf`
  - `prepare-azure-comment`
  - `prepare-status-report`
  - `run-playwright-evidence`

#### Atualizacao E - Promocao de Decisoes de Chat

- `core/docs/CHAT_TO_ARTIFACT_GOVERNANCE.md` formaliza a regra.

#### Atualizacao F - CVP/SIAS QA Pack 1.1

Pendente integrar na proxima revisao de `CVP_SIAS_QA_PACK.md`:

- [ ] Adicionar classificacao `FAILED_BLOCKING`.
- [ ] Adicionar regra de bug derivado separado.
- [ ] Adicionar regra de validacao de CT completo em reteste.
- [ ] Adicionar padrao de Markdown/PDF usado nos ultimos CTs.
- [ ] Adicionar regra de limpeza de versoes antigas geradas na mesma rodada.
- [ ] Adicionar regra de status report tabulado (TSV).
- [ ] Adicionar regra `MY-BUGS` para substituir `A CRIAR` por ID real quando
      houver correspondencia segura.

#### Atualizacao G - Squad Index 2.1

- `core/docs/SQUAD_INDEX.md` v2.1 inclui colunas Nivel, Certs default,
  Habilidades principais. Link para `AGENT_LEVELS_AND_CERTIFICATIONS.md`,
  `AGENT_CERTIFICATIONS.md` e `AGENT_UNLOCKS.md`.

### Pendente (proxima revisao)

- [ ] Atualizar prompts CVP/SIAS individuais com metadados de nivel/cert
      (campos `Nivel atual:`, `Certificacoes:`, `Unlocks:` no header da
      gem, conforme `core/agents/_template/gem-skeleton.md`).
- [ ] Inicializar `core/memory/agents/<slug>/agent-profile.md` para cada um
      dos 7 agentes CVP/SIAS.
- [ ] Atualizar brains CVP/SIAS com novos campos de capability tracking.
- [ ] Espelhar skills locais `<cvp-sias-repo>/.cursor/skills/cvp-sias-*`
      como referencia neste pack (sem duplicar conteudo).

### Riscos e mitigacoes (do dossie 13)

| Risco | Impacto | Mitigacao implementada |
|-------|---------|-----------------------|
| Transformar chat em fonte oficial | Alto | `core/docs/CHAT_TO_ARTIFACT_GOVERNANCE.md` |
| Confundir XP/ritual com metrica real | Medio | `governance/RITUALS_GUARDRAILS.md` |
| Agente decidir status Azure sozinho | Critico | Mantida revisao humana obrigatoria; nunca automacao pura |
| Prompts CVP/SIAS divergirem das skills locais | Alto | Este CHANGELOG + headers de origem em cada gem |
| Certificacoes virarem decorativas | Medio | `core/docs/PROMOTION_AND_EVOLUTION_CRITERIA.md` exige evidencia auditavel |
| Azure automatizado sem seguranca | Critico | MVP local-first; sem escrita automatica em Azure |
| Snapshot local incompleto | Alto | Repositorio cliente CVP/SIAS continua canonico para evidencias |

## Veja tambem

- `<cvp-sias-repo>/analise-feltrim-agents-cvp/13-dossie-atualizacao-feltrim-agents-github.md`
  (dossie original)
- `README.md` deste pack
- `CVP_SIAS_QA_PACK.md` (regras operacionais)
- `FELTRIM_AGENTS_CVP_SIAS_OPERATING_CONTRACT.md` (regras nao-negociaveis)
- `FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md` (niveis e certs do pack)
- `core/docs/AGENT_CERTIFICATIONS.md` (catalogo geral)
- `core/docs/AGENT_UNLOCKS.md` (catalogo geral)
- `core/docs/SQUAD_INDEX.md` v2.1 (roster core)
