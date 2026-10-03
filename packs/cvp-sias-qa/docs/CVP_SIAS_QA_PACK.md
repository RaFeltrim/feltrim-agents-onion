<!-- origem: feltrim-agents-base/.../docs/CVP_SIAS_QA_PACK.md -->
<!-- migrada para pack cvp-sias-qa em 2026-05-16: paths absolutos substituidos por placeholders relativos -->

# Pacote CVP/SIAS QA — Feltrim Agents

Camada especializada para trabalhos de QA no projeto CVP/SIAS. Use este pacote quando o objetivo envolver reteste de bugs, execução de CT, comparação Mainframe x Web, evidência/PDF, comentário Azure, status report ou hub visual.

## Princípios operacionais

- Mainframe é o oráculo operacional para paridade.
- Azure DevOps/Test Plans é a fonte de verdade operacional.
- Rastreabilidade obrigatória: sistema, frente, processo/suite, CT, run, bug, massa, evidência, PDF e report.
- Divergência Web x Mainframe comprovada é critério de bug.
- Dados diferentes e rota bloqueante são críticos.
- `PASSED_WITH_RESSALVA` só vale para divergência visual/textual sem impacto funcional.
- Achado novo comprovado vira bug separado.
- Não fechar `PASSED` apenas porque o defeito original parece corrigido; valide o CT completo.

## Memoria operacional do pacote

Os agentes CVP/SIAS QA possuem cerebros persistentes em `memory/agents/cvp-sias-*/brain.md`. Use esses arquivos para registrar experiencia acumulada, handoffs, aprendizados, limites humanos e padroes recorrentes que nao pertencem ao prompt canonico.

Calls e combinados devem usar `memory/team-rituals/team-call-notes-template.md`. Pre-daily social/operacional deve seguir `memory/team-rituals/pre-daily.md`.

Guardrail: conversa social e cultura de time nao sao fonte de verdade tecnica. Qualquer decisao sobre status, bug, evidencia, CT, run, criterio QA ou Azure deve ser promovida para Azure DevOps/Test Plans, backlog, ADR, report ou documento operacional.

## Integracao com o repo CVP/SIAS

Use este pacote junto com o repositorio principal `<cvp-sias-repo>`.

Referencias locais obrigatorias:

- `.cursor/rules/qa-bug-opening-criteria.mdc` — criterio de bug, ressalva, severidade e comentario/status.
- `.cursor/rules/feltrim-agents-prompts.mdc` — como consultar prompts especializados sem copiar prompt longo para a conversa.
- `.cursor/skills/cvp-sias-bug-retest/SKILL.md` — reteste de bug e decisao `PASSED`, `FAILED`, `NOT_FIXED`, `BLOCKED` ou bug derivado.
- `.cursor/skills/cvp-sias-ct-execution/SKILL.md` — execucao de CT com BDD, massa e evidencia por step.
- `.cursor/skills/cvp-sias-evidence-azure/SKILL.md` — Markdown/PDF, comentario Azure, status report e bug suggestion.
- `.cursor/skills/cvp-sias-hub-implementation/SKILL.md` — evolucao do hub local-first em `bug-capture-sias-automation/`.
- `.cursor/skills/feltrim-multiagent-rituals/SKILL.md` — pre-daily, calls, handoffs, memorias e cultura multiagente.

Base RPA local:

- `bug-capture-sias-automation/docs/RPA_BEST_PRACTICES.md`;
- `bug-capture-sias-automation/docs/RPA_DEV_PROGRESS.md`;
- `bug-capture-sias-automation/docs/RPA_FLASH_TALKS.md`.

## Como o orquestrador deve escolher agentes

| Situação | Agente |
|----------|--------|
| Planejar e consolidar fluxo completo CVP/SIAS | `CVP/SIAS — QA Orchestrator` |
| Retestar bug e decidir se fecha, falha ou abre bug novo | `CVP/SIAS — Bug Retest Agent` |
| Executar CT completo e classificar resultado | `CVP/SIAS — CT Execution Agent` |
| Gerar/revisar pacote de evidência e PDF | `CVP/SIAS — Evidence PDF Agent` |
| Redigir comentário Azure, status de run e status report | `CVP/SIAS — Azure Comment Status Agent` |
| Rodar automação Web Playwright com evidência técnica | `CVP/SIAS — Playwright Runner Agent` |
| Consolidar painel/hub de progresso, lacunas e riscos | `CVP/SIAS — Dashboard Hub Agent` |

## Fluxo recomendado

1. Comece pelo `CVP/SIAS — QA Orchestrator` quando houver mais de um bloco de trabalho.
2. Use `Bug Retest` quando o foco for um bug original.
3. Use `CT Execution` quando o foco for validar o caso de teste completo.
4. Use `Playwright Runner` apenas para o bloco Web automatizável; ele não substitui a comparação Mainframe.
5. Use `Evidence PDF` antes de anexar ou distribuir evidências finais.
6. Use `Azure Comment Status` para transformar decisão QA em comentário/status rastreável.
7. Use `Dashboard Hub` para consolidar ciclo, riscos e lacunas.

## Status padrão

- `PASSED`: CT completo validado, comportamento principal correto e sem divergência funcional.
- `PASSED_WITH_RESSALVA`: apenas divergência visual/textual sem impacto funcional.
- `FAILED`: falha funcional, divergência Web x Mainframe, dado diferente, rota bloqueante, regra violada ou persistência incorreta.
- `BLOCKED`: execução impedida por acesso, ambiente, massa, rota ou erro técnico.
- `NEEDS_HUMAN`: falta decisão, evidência, acesso ou interpretação que não deve ser inferida pelo agente.

## Roteiro mínimo de entrega

Toda entrega CVP/SIAS deve deixar claro:

- Escopo: sistema, frente, processo/suite, CT, run e bug.
- Massa usada e ambiente.
- Evidência Web e Mainframe quando aplicável.
- Status recomendado e justificativa.
- Bug novo separado quando houver achado diferente.
- PDF/evidência final e comentário Azure/status report.

## Participacao no hub QA

- `QA Orchestrator` consolida escopo, fila, riscos, lacunas e handoffs.
- `Bug Retest` e `CT Execution` alimentam manifestos, evidencias e status recomendados.
- `Playwright Runner` executa somente o bloco Web automatizavel e coleta evidencia tecnica; ele nao substitui Mainframe nem decisao humana.
- `Evidence PDF` normaliza evidencias, PDFs e textos copiaveis.
- `Azure Status` prepara comentarios e status reports revisaveis; no MVP, nao escreve automaticamente no Azure.
- `Dashboard Hub` consolida progresso, lacunas e proximos passos no hub visual.

## Estado atual

### Implementado

- Prompts canonicos dos 7 agentes CVP/SIAS QA em `agents/gem_cvp_sias_*.md`.
- Cerebros iniciais em `memory/agents/cvp-sias-*/brain.md`.
- Regras e skills locais no repo CVP/SIAS para bug retest, CT execution, evidencia/Azure, hub e rituais.
- Documentacao RPA no repo principal para Playwright, Python, UiPath/desktop quando aplicavel e Robot Framework como alternativa keyword-driven.

### Parcialmente implementado

- Hub local-first e manifest-driven prepara artefatos revisaveis, mas a operacao Azure permanece humana.
- Cultura, XP simbolico e escala temporal estao documentados para rituais; a gamificacao completa ainda nao existe como sistema.

### Pendente

- Loja, inventario, scoreboard ou economia completa de XP.
- Escrita automatica no Azure, dependente de desenho tecnico, auditoria, credenciais seguras e aprovacao explicita.
- Promocao sistematica de decisoes de rituais para ADR/backlog/runbook/report/status quando houver impacto auditavel.

## Guardrails gerais

- Não inventar evidência, ID de Azure, massa ou resultado de tela.
- Não transformar divergência funcional em ressalva.
- Não publicar status final com PDF, comentário e evidência conflitantes.
- Não apagar versões antigas/conflitantes sem autorização explícita; listar para limpeza.
- Parar e pedir intervenção humana em caso de acesso, MFA, captcha, massa inválida, ambiente instável ou decisão de negócio.
- Nao fingir consciencia, sentimento real ou relacao humana real dos agentes.
- Cultura, rituais, XP e escala temporal sao simbolicos e nao substituem metricas reais.
- Azure, evidencias, PDFs, reports, prazos, contratos e comunicacoes externas usam datas humanas reais.
