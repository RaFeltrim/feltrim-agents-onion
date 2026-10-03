<!-- origem: <cvp-sias-repo>/docs/FELTRIM_AGENTS_CVP_SIAS.md -->
<!-- migrada para pack cvp-sias-qa em 2026-05-16: paths absolutos substituidos por placeholders relativos -->

# Integracao Feltrim Agents CVP/SIAS

Este documento conecta o repo CVP/SIAS aos prompts, memorias, rituais, rules e skills dos Feltrim Agents. Ele deve orientar uma pessoa ou agente novo sem duplicar a fonte canonica.

## Onde fica cada coisa

| Artefato | Caminho | Uso |
|---|---|---|
| Prompts canonicos | `<feltrim-agents-base>\agents` | Personas e responsabilidades dos agentes. |
| Guia do squad | `<feltrim-agents-base>\docs\SQUAD_INDEX.md` | Roster, triggers e modelo de delegacao. |
| Guia CVP/SIAS QA | `<feltrim-agents-base>\docs\CVP_SIAS_QA_PACK.md` | Fluxo especializado de reteste, CT, evidencia, Azure/status e hub. |
| Cerebros/memorias | `<feltrim-agents-base>\memory\agents` | Aprendizados, handoffs e limites operacionais por agente. |
| Rituais | `<feltrim-agents-base>\memory\team-rituals` | Pre-daily, calls, flash talks, snack breaks, game nights e hackathons. |
| Rules locais | `.cursor/rules/` | Guardrails sempre aplicados neste projeto. |
| Skills locais | `.cursor/skills/` | Workflows executaveis/referenciaveis por tipo de trabalho. |
| Hub/RPA | `bug-capture-sias-automation/` | Base local-first para automacao, manifestos, evidencias, reports e dashboard. |

## Agentes CVP/SIAS

| Agente | Prompt | Quando usar |
|---|---|---|
| QA Orchestrator | `gem_cvp_sias_qa_orchestrator.md` | Planejar e consolidar trabalho com mais de um bloco: bug, CT, evidencia, status e hub. |
| Bug Retest | `gem_cvp_sias_bug_retest.md` | Retestar bug, separar defeito original de achado novo e recomendar status. |
| CT Execution | `gem_cvp_sias_ct_execution.md` | Executar CT completo, BDD por step, massa e Web x Mainframe. |
| Evidence PDF | `gem_cvp_sias_evidence_pdf.md` | Consolidar Markdown/PDF, evidencias e versoes finais. |
| Azure Status | `gem_cvp_sias_azure_status.md` | Preparar comentario Azure, status de run/CT, status report e texto copiavel. |
| Playwright Runner | `gem_cvp_sias_playwright_runner.md` | Rodar bloco Web automatizavel e coletar evidencia tecnica. |
| Dashboard Hub | `gem_cvp_sias_dashboard_hub.md` | Consolidar painel, lacunas, riscos, fila e proximos passos. |

## Documentacao operacional nova

- `docs/FELTRIM_AGENTS_CVP_SIAS_OPERATING_CONTRACT.md`: contrato operacional aplicado ao chat e aos fluxos CVP/SIAS.
- `docs/FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md`: niveis, certificacoes internas, habilidades desbloqueadas e conhecimento de projeto esperado.
- `analise-feltrim-agents-cvp/13-dossie-atualizacao-feltrim-agents-github.md`: pacote para atualizar o repositorio principal dos Feltrim Agents no GitHub.
- `analise-feltrim-agents-cvp/14-contrato-operacional-chat-cvp-sias.md`: registro de aplicacao deste contrato no chat atual.
- `.cursor/rules/cvp-sias-feltrim-agents-operating-contract.mdc`: rule local always-on para preservar o comportamento.

## Rules e skills deste projeto

Rules sempre aplicadas:

- `.cursor/rules/qa-bug-opening-criteria.mdc`: divergencia Web x Mainframe, bug separado, ressalva, severidade, evidencia e comentario/status.
- `.cursor/rules/feltrim-agents-prompts.mdc`: consulta ao repo externo de prompts antes de delegar trabalho especializado.
- `.cursor/rules/specify-rules.mdc`: Spec Kit e rastreabilidade CVP/SIAS quando o fluxo envolver especificacoes.
- `.cursor/rules/cvp-sias-feltrim-agents-operating-contract.mdc`: contrato operacional CVP/SIAS dos Feltrim Agents aplicado em todo chat.

Skills locais:

- `.cursor/skills/cvp-sias-bug-retest/SKILL.md`: reteste de bugs CVP/SIAS.
- `.cursor/skills/cvp-sias-ct-execution/SKILL.md`: execucao de CT com BDD/TDD, massa e evidencia.
- `.cursor/skills/cvp-sias-evidence-azure/SKILL.md`: evidencias, PDFs, comentarios Azure e status reports.
- `.cursor/skills/cvp-sias-hub-implementation/SKILL.md`: evolucao do hub local-first em `bug-capture-sias-automation/`.
- `.cursor/skills/feltrim-multiagent-rituals/SKILL.md`: calls, handoffs, memorias e cultura multiagente.

## Como usar no hub QA

1. Comece pelo `QA Orchestrator` quando houver reteste, CT, evidencia e status no mesmo fluxo.
2. Use `Bug Retest` para validar o bug original e decidir `PASSED`, `FAILED`, `NOT_FIXED`, `BLOCKED`, `PASSED_WITH_RESSALVA` ou bug derivado.
3. Use `CT Execution` quando o foco for o CT completo, com massa, steps e comparacao Web x Mainframe.
4. Use `Playwright Runner` somente para o trecho Web automatizavel; ele nao substitui Mainframe nem decisao humana.
5. Use `Evidence PDF` e `Azure Status` para preparar artefatos revisaveis antes de anexar/comentar.
6. Use `Dashboard Hub` para consolidar fila, progresso, lacunas e riscos.

O MVP do hub deve permanecer local-first: preparar dados, manifestos, evidencias, comentarios e status reports revisaveis. Nao ha escrita automatica no Azure no MVP.

## Estado atual

### Implementado

- Prompts especializados CVP/SIAS em `feltrim-agents-base/agents`.
- Cerebros iniciais em `feltrim-agents-base/memory/agents`.
- Rituais em `feltrim-agents-base/memory/team-rituals`.
- Rules e skills locais em `.cursor/rules/` e `.cursor/skills/`.
- Base RPA documentada em `bug-capture-sias-automation/docs/`.

### Parcialmente implementado

- Hub QA/RPA local-first com documentacao, manifestos e saidas revisaveis; Azure continua sendo fonte operacional e acao humana.
- Gamificacao/cultura com escala temporal e XP simbolico em rituais; nao existe loja/inventario completos.
- Promocao de decisoes de calls para ADR/backlog/runbook/status/report existe como guardrail, mas precisa ser feita caso a caso.

### Pendente

- Sistema completo de XP, loja, inventario, carteira ou scoreboard.
- Escrita automatica no Azure a partir do hub.
- Governanca formal para atualizar cerebros/memorias de forma recorrente.
- Inicializacao de cerebros para agentes genericos ainda nao usados de forma recorrente.

## Guardrails

- Agentes nao possuem consciencia, sentimentos reais, cansaco real ou amizade real.
- Cultura, snacks, games, XP e escala temporal sao simbolicos e nao substituem metricas reais.
- `1 dia humano = 1 hora operacional dos agentes` vale apenas para cultura, rituais e gamificacao.
- Azure, evidencias, PDFs, reports, contratos, SLAs, prazos e comunicacoes externas usam datas humanas reais.
- Decisoes tecnicas auditaveis devem ir para ADR, backlog, runbook, bug, Azure/status, report ou documento operacional.
- Nao inventar IDs, massa, status, evidencia, comportamento de tela ou resultado Mainframe.
- Sem escrita automatica no Azure no MVP; comentarios/status devem ser revisaveis por humano.
