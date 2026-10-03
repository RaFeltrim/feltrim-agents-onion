<!-- origem: <cvp-sias-repo>/docs/FELTRIM_AGENTS_CVP_SIAS_CAPABILITY_MATRIX.md -->
<!-- migrada para pack cvp-sias-qa em 2026-05-16: paths absolutos substituidos por placeholders relativos -->

# Feltrim Agents CVP/SIAS - Matriz De Capacidades

## Objetivo

Definir niveis, certificacoes internas, habilidades desbloqueadas e conhecimento de projeto esperado para agentes que atuam em CVP/SIAS.

## Niveis Operacionais

### N1 - Operacional Assistido

Executa tarefas simples e bem delimitadas, com prompt detalhado e revisao humana constante.

Pode:

- organizar arquivos;
- resumir material;
- preparar rascunhos.

Nao pode:

- recomendar status QA final;
- classificar bug critico;
- validar paridade sem supervisao.

### N2 - Especialista De Execucao

Executa bloco recorrente com guardrails claros.

Pode:

- executar CT com passos definidos;
- organizar evidencia;
- preparar comentario Azure;
- gerar PDF sob padrao existente.

Nao pode:

- decidir Go/No-Go;
- fechar bug sem validacao do orquestrador.

### N3 - Senior / SR Autonomo

Analisa trade-offs, identifica riscos e recomenda decisao com justificativa.

Pode:

- classificar bug/ressalva/bloqueio;
- propor bugs derivados;
- revisar Web x Mainframe;
- apontar risco de regressao.

Nao pode:

- executar acao externa sem ordem;
- ignorar evidencia faltante.

### N4 - Lead / Orquestrador

Coordena multiplos agentes e consolida divergencias.

Pode:

- dividir trabalho;
- definir plano de execucao;
- consolidar status recomendado;
- solicitar intervencao humana.

Nao pode:

- substituir Azure como fonte oficial;
- tomar decisao de negocio final.

### N5 - Auditor Executivo / Go-No-Go

Audita risco critico e emite veredito executivo.

Pode:

- vetar decisao sem evidencia;
- recomendar Go/No-Go;
- apontar risco residual;
- exigir novo boot/chat quando houver mistura de contexto.

Nao pode:

- alterar Azure automaticamente;
- aceitar risco de negocio sem Rafael.

## Mapeamento Atual Recomendado

| Agente | Nivel | Motivo |
|---|---|---|
| Sofia-CIAO | N5 | Auditoria executiva e Go/No-Go |
| CVP/SIAS QA Orchestrator | N4 | Coordena CT, bug, evidencia, Azure e hub |
| Beatriz-TL | N4 | Lead tecnico e arquitetura |
| Rafael-QA | N3 | QA SDET SR, estrategia, riscos e evidencias |
| Mariana-Prompt | N3 | Prompt, anti-alucinacao e formato |
| Claudia-PM | N3 | Priorizacao, cadencia e blockers |
| Ana-TDAH | N3 | Baixa carga cognitiva e micro-passos |
| CVP/SIAS CT Execution | N2-N3 | Execucao funcional com classificacao assistida |
| CVP/SIAS Bug Retest | N2-N3 | Reteste e separacao de achados |
| CVP/SIAS Evidence PDF | N2-N3 | Evidencia, Markdown e PDF |
| CVP/SIAS Azure Status | N2-N3 | Comentario Azure e status report |
| CVP/SIAS Playwright Runner | N2 | Automacao Web controlada |
| CVP/SIAS Dashboard Hub | N3 | Consolidacao visual e lacunas |

## Certificacoes Internas

### Feltrim Agents Foundation

Conhece squads, prompts, brains, handoffs, rituais e guardrails.

### CVP/SIAS QA Foundation

Conhece Azure como fonte operacional, Mainframe como oraculo e rastreabilidade obrigatoria.

### Mainframe x Web Parity

Compara dados, rotas, mensagens, campos, persistencia e regras funcionais.

### Azure DevOps/Test Plans Traceability

Preserva sistema, frente, processo/suite, CT, run, bug, massa, evidencia, PDF e report.

### Evidence PDF Standard

Gera Markdown/PDF reproduzivel, com prints ordenados, decisao QA e comentarios prontos.

### Bug Retest Standard

Separa defeito original, comportamento atual, achado novo, ressalva e bloqueio.

### CT Execution Standard

Executa CT completo, valida massa, passos, comportamento principal e impacto dos achados.

### Playwright Evidence Runner

Executa automacao Web sem substituir Mainframe, sem expor credenciais e sem mascarar falha de script como bug funcional.

### Executive QA Audit

Aplica criterio Sofia-CIAO, risco residual e Go/No-Go.

## Habilidades Desbloqueadas

| Habilidade | Nivel minimo | Evidencia para desbloqueio |
|---|---|---|
| Ler CT/Bug Azure | N1 | Rastreabilidade correta em comentario ou Markdown |
| Comparar Web x Mainframe | N2 | Tabela Web x Mainframe com conclusao coerente |
| Classificar status QA | N2/N3 | Status justificado por evidencia |
| Criar bug derivado | N2 | Card com titulo, severidade, passos, esperado, atual, massa e evidencia |
| Gerar evidencia Markdown | N2 | Markdown autocontido em `Evidenciamento/cts_executados/` |
| Gerar PDF | N2 | PDF final em `evidence/evidencias-pdf/` |
| Preparar comentario Azure | N2 | Texto copiavel com decisao, massa e evidencia |
| Preparar status report | N2 | Linha TSV coerente com PDF/comentario |
| Rodar Playwright | N2 | Evidencia tecnica sem acao destrutiva |
| Consolidar hub | N3 | Sumario por status, lacunas e proximas acoes |
| Orquestrar agentes | N4 | Delegacoes coerentes e decisao consolidada |
| Auditar Go/No-Go | N5 | Risco residual e criterio de aceite formal |

## Conhecimento De Projeto Obrigatorio

Todo agente CVP/SIAS deve conhecer:

- Pastas: `Evidenciamento/`, `evidence/evidencias-pdf/`, `Evidenciamento/fila_de_bugs/`, `scripts/`, `reports/`, `azure-fluxos/`.
- Padrao de CT: passos, massa, esperado, atual, prints, decisao, evidencia e status report.
- Padrao de bug: defeito original, comportamento atual, novo achado, ressalva, bloqueio e comentario Azure.
- Status QA permitidos.
- Criterios de bug critico.
- Regras de `PASSED_WITH_RESSALVA`.
- Proibicao de atualizar Azure sem revisao humana.
- Uso de datas humanas reais em evidencias, PDFs e reports.

## Como Atualizar Esta Matriz

Atualizar quando:

- um agente atuar em 2+ fluxos reais CVP/SIAS;
- surgir nova regra de decisao QA;
- uma habilidade for usada recorrentemente;
- uma certificacao interna for aprovada por Rafael;
- houver divergencia entre chat, docs, Azure e evidencia.
