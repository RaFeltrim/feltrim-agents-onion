# Pack: CVP/SIAS QA

> Pacote especializado para trabalho QA no projeto CVP/SIAS (consumidor
> CVP/SIAS opera Mainframe SIAS + V3Online Web). Cobre o ciclo completo:
> leitura de CT/bug Azure -> execucao funcional -> comparacao Web x
> Mainframe -> classificacao QA -> evidencia Markdown/PDF -> comentario
> Azure -> status report -> dashboard/hub local-first.

## Atencao

**Este pack contem referencias diretas ao projeto cliente CVP/SIAS.** Nao
copie regras deste pack para `core/` nem para outros packs - viola
`governance/SECURITY_AND_PRIVACY.md`.

## Estrutura

```
packs/cvp-sias-qa/
|-- README.md                                  (este arquivo)
|-- agents/
|   |-- gem_cvp_sias_qa_orchestrator.md        (N4 - orchestrator)
|   |-- gem_cvp_sias_bug_retest.md             (N3)
|   |-- gem_cvp_sias_ct_execution.md           (N3)
|   |-- gem_cvp_sias_evidence_pdf.md           (N2-N3)
|   |-- gem_cvp_sias_azure_status.md           (N2-N3)
|   |-- gem_cvp_sias_playwright_runner.md      (N2)
|   `-- gem_cvp_sias_dashboard_hub.md          (N3)
|-- brains/
|   |-- cvp-sias-qa-orchestrator/brain.md
|   |-- cvp-sias-bug-retest/brain.md
|   |-- cvp-sias-ct-execution/brain.md
|   |-- cvp-sias-evidence-pdf/brain.md
|   |-- cvp-sias-azure-status/brain.md
|   |-- cvp-sias-playwright-runner/brain.md
|   `-- cvp-sias-dashboard-hub/brain.md
|-- docs/
|   |-- CVP_SIAS_QA_PACK.md                    (regras operacionais do pack)
|   |-- FELTRIM_AGENTS_CVP_SIAS.md             (vinculo do repo cliente com FF)
|   |-- FELTRIM_AGENTS_CVP_SIAS_OPERATING_CONTRACT.md  (regras nao-negociaveis)
|   |-- FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md   (niveis + certs CVP/SIAS)
|   `-- CHANGELOG.md                           (historico consolidando dossie 13)
|-- skills/
`-- (vazio - skills locais ficam no repo cliente)
```

## Como ativar

Em uma sessao Claude Code / Cursor / IDE no repositorio cliente CVP/SIAS:

```
Carregue:
1. core/CLAUDE.md
2. core/memory/MEMORY.md
3. core/docs/SQUAD_INDEX.md
4. packs/cvp-sias-qa/README.md (este arquivo)
5. packs/cvp-sias-qa/docs/CVP_SIAS_QA_PACK.md
6. packs/cvp-sias-qa/docs/FELTRIM_AGENTS_CVP_SIAS_OPERATING_CONTRACT.md
```

A partir dai, invocar Sofia CIAO (CIAO core) ou QA Orchestrator deste pack
para qualquer tarefa CVP/SIAS.

## Fonte da verdade

- **Azure DevOps / Test Plans**: source of truth operacional (CT, bug, run, status).
- **Mainframe SIAS**: source of truth funcional (oraculo da regra correta).
- **Repositorio cliente CVP/SIAS local**: memoria versionada de evidencias, prints e PDFs.
- **Este pack**: definicao de papeis, regras e padroes do framework Feltrim Agents
  aplicado ao projeto.

## Decisor humano

Rafael Feltrim. Toda decisao de classificacao QA, abertura de bug derivado,
PASSED_WITH_RESSALVA, NEEDS_HUMAN ou Go/No-Go de release fica com o
decisor humano.

## Roster do pack

| Agente | Papel | Nivel | Quando invocar |
|--------|-------|-------|----------------|
| QA Orchestrator | N4 | Orquestrador do pack | Coordena os 6 agentes operacionais; consolida divergencias |
| Bug Retest | N3 | Reteste de bug | Bug original + comportamento atual + achado novo + ressalva + bloqueio |
| CT Execution | N3 | Executar CT completo | Passos + massa + comparativo Web x Mainframe + status |
| Evidence PDF | N2-N3 | Gerar evidencia reproduzivel | Markdown autocontido + PDF final + limpeza de versoes antigas |
| Azure Status | N2-N3 | Preparar comentario Azure | Comentario rastreavel para colar em Azure DevOps |
| Playwright Runner | N2 | RPA Web SIAS / V3Online | Automacao com evidencia, sem mascarar falha de script como bug funcional |
| Dashboard Hub | N3 | Consolidacao local-first | Reune estado de CTs/bugs/runs para visao executiva |

## Certificacoes especificas do pack

Catalogo em `docs/FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md` e (em
detalhe) seguindo o catalogo geral `core/docs/AGENT_CERTIFICATIONS.md`.

Certs CVP/SIAS especificas:

- `CVP-QA-FOUND` - CVP/SIAS QA Foundation (Azure como source of truth +
  Mainframe como oraculo).
- `MF-WEB-PARITY` - Mainframe x Web Parity (compara dados, rotas,
  mensagens, persistencia e regras).
- `AZ-TRACE` - Azure DevOps/Test Plans Traceability (preserva sistema,
  frente, suite, CT, run, bug, massa, evidencia, PDF, report).
- `EVIDENCE-PDF` - Evidence PDF Standard (gera evidencia reproduzivel,
  limpa conflitos).
- `BUG-RETEST` - Bug Retest Standard (separa bug original + atual + novo +
  ressalva + bloqueio).
- `CT-EXEC` - CT Execution Standard.
- `PLAYWRIGHT-EVIDENCE` - Playwright Evidence Runner (nao substitui
  Mainframe; nao mascara falha de script).
- `EXEC-QA-AUDIT` - Executive QA Audit (veredito Sofia-CIAO + Go/No-Go +
  risco residual).

## Skills locais

Skills operacionais do pack vivem no repositorio cliente CVP/SIAS em
`.cursor/skills/cvp-sias-*` e `.cursor/skills/feltrim-multiagent-rituals/`.

## Veja tambem

- `docs/CVP_SIAS_QA_PACK.md` - regras operacionais consolidadas
- `docs/CHANGELOG.md` - historico de atualizacoes (consolida dossie 13)
- `docs/FELTRIM_AGENTS_CVP_SIAS_OPERATING_CONTRACT.md` - regras nao-negociaveis
- `docs/FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md` - niveis + certs do pack
- `core/docs/SQUAD_INDEX.md` - roster core
- `governance/COMPANY_CHARTER.md` - identidade da empresa
