# Decisoes Pendentes - Feltrim Agents Base Rebrand

Este arquivo concentra tudo que ficou em aberto durante a migracao das 5
origens para este boilerplate. Cada item tem hipoteses, recomendacao e quem
decide.

## Status final da migracao (2026-05-16)

| ID | Item | Status |
|----|------|--------|
| 1 | Profundidade sanitizacao us-avaliator | Parcial (PR9 opcao B) - falta decidir extras |
| 2 | IP gems-external | Implementado (bloqueado em `legacy/gems-external/IP_PENDENTE.md`) - falta auditoria de origem |
| 3 | Pack `feltrim-internal` | Implementado snapshot em `legacy/feltrim-agents-base-v2/` - falta decidir criar pack ativo |
| 4 | Spec Kit no boilerplate | Implementado (`.specify/memory/constitution.md` generico) |
| 5 | Split `integrations/` core vs pack | Implementado default (core com placeholders) - falta auditoria por integracao |
| 6 | Licenca final | Pendente (proprietaria provisoria em vigor) |
| 7 | Versao canonica gens | Implementado (v2 sanitizada como base) |
| 8 | Pack `feltrim-internal/marketplaces/` | Pendente (depende de 3) |
| 9 | Brains com aprendizados especificos | Implementado (split core vs pack) |
| 10 | Boot sequence `CLAUDE.md` raiz | Implementado (ponteiro para core) |
| 11 | Politica de ativacao de agentes e economia de token | Implementado em PR11 (`AGENT_ACTIVATION_POLICY.md`, `TOKEN_ECONOMY.md`, `feature-init.md`, anti-patterns nas 15 gens, SQUAD_INDEX v2.2, 2 exemplos). Falta medir consumo real e ajustar |

---

## 1. Profundidade da sanitizacao do pack `us-avaliator`

**Status PR9 (2026-05-16):** PARCIALMENTE RESOLVIDO via opcao (B).

**Contexto:** `Four/Gherkin-Manager_Fase1_Pacote/01_Documentos_Oficiais/`
contem proposta de substituicao do Copilot, laudo de qualidade V4 e atas com
referencias a clientes reais (3 nomes - flag words) e a valores financeiros
internos.

**Hipoteses:**

- (A) Sanitizar profundamente: trocar todo nome de cliente por placeholders
  generericos `<cliente-A>`, `<cliente-B>` e remover valores monetarios.
  Pack fica utilizavel publicamente. [Pendente decisao]
- (B) Sanitizar levemente: apenas `Proposta_Final_Substituicao_Copilot.md` +
  14 relatorios de agentes vao sanitizados para o pack; Laudo V4, Ata
  Governanca, Auditoria 360 e Evidencia ficam apenas em `legacy/`.
  **[IMPLEMENTADO em PR9.]**
- (C) Nao criar o pack: tudo vai para `legacy/gherkin-manager-fase1/` com
  bloqueio publico. [Descartada - pack tem valor demonstrativo do team-call]

**Implementado em PR9:**

- Proposta sanitizada: R$ -> `<custo-redigido>`, Joao -> `<lider>`,
  30 QAs -> `<N QAs>`, `Rafael Feltrim` em contexto de equipe -> `<autor>`
  (mantido apenas como autoria em "De:", footer e creditos).
- 14 relatorios de agentes sanitizados (`<autor>`, `<lider>`,
  `<custo-redigido>`).

**Pendente decisao (proxima rodada):**

- [ ] Definir se Laudo V4 / Ata Governanca / Auditoria 360 / Evidencia entram
  via opcao (A) com placeholders `<cliente-A/B/C>`, ou se ficam apenas em
  `legacy/gherkin-manager-fase1/`.

**Decisor:** Rafael Feltrim.

---

## 2. IP do catalogo `gems-external`

**Contexto:** `Four/gems/Gems.md` (e 2 duplicatas) e um catalogo Perplexity
com 24 gems com referencia explicita a "padrao Equifax", "BAP", "Splunk
Equifax" e nomes de profissionais terceiros (Daniela Domeniconi, Leonardo
Cordiolli, Matheus Ferreira, etc).

**Hipoteses:**

- (A) Manter em `legacy/gems-external/` com `IP_PENDENTE.md` bloqueando uso
  ate auditoria de origem (autor real x autoria atribuida x licenca de uso).
- (B) Excluir totalmente.
- (C) Pedir lista de autoria/licenca formal e, com autorizacao, transformar
  em pack `feltrim-external-references` apenas com referencias para estudo
  (sem copiar prompts).

**Recomendacao default:** (A). Implementado em PR10.

**Decisor:** Rafael Feltrim (consultar fonte original).

---

## 3. Pack `feltrim-internal` (4o pack opcional)

**Contexto:** `feltrim-agents-base/CLAUDE.md` original contem regras
operacionais especificas da empresa do Rafael: marketplaces (ML, Magalu,
Shopee, Tiny ERP), DFS, ANATEL, prefixos SKU, Chrome Profile dedicado. Isso
nao e cliente, e do proprio Rafael.

**Hipoteses:**

- (A) Criar `packs/feltrim-internal/` agora com MARKETPLACES.md,
  ARQUITETURA-MARKETPLACES.md, integracoes especificas Tiny/ML/Shopee. Pack
  ativo no MVP.
- (B) Manter em `legacy/feltrim-agents-base-v2/` ate Rafael confirmar.
- (C) Quebrar: ADRs genericas (Supabase, BullMQ, atomic writes) vao para
  `core/docs/adr/`; resto vai para `packs/feltrim-internal/`.

**Recomendacao default:** (C). Implementado em PR10 (snapshot em legacy,
ADRs genericas em core/docs/adr/).

**Decisor:** Rafael Feltrim.

---

## 4. Spec Kit `.specify/` no boilerplate

**Contexto:** O repositorio CVP/SIAS usa Spec Kit com constituicao especifica.
Faz sentido o boilerplate da empresa ja vir com Spec Kit configurado para
acelerar novos projetos?

**Hipoteses:**

- (A) Sim, com constituicao generica em `.specify/memory/constitution.md`
  (5 principios sem CVP).
- (B) Nao - Spec Kit e por projeto, nao por empresa.

**Recomendacao default:** (A). Implementado em PR10.

**Decisor:** Rafael Feltrim.

---

## 5. Split `integrations/` core vs pack

**Contexto:** `feltrim-agents-base/integrations/` tem openclaw, n8n, obsidian
e pixel-agents. Algumas sao genericas (n8n, obsidian) e outras especificas da
empresa Rafael (openclaw self-hosted, pixel agents configurado).

**Hipoteses:**

- (A) Tudo em `core/integrations/` como esqueletos genericos (sem credenciais
  Rafael), e o pack `feltrim-internal` referencia.
- (B) Split por integracao baseado em quao especifica e.

**Recomendacao default:** (A). Implementado em PR4/PR10.

**Decisor:** Rafael Feltrim.

---

## 6. Licenca final

**Contexto:** `LICENSE` esta como proprietaria provisoria.

**Hipoteses:**

- (A) Proprietaria fechada (so Rafael e autorizados).
- (B) Source-available com clausula no-commercial.
- (C) MIT/Apache 2.0 com excecao para `packs/cvp-sias-qa/` (que herda IP do
  cliente).
- (D) Dual license: core MIT, packs proprietarios.

**Recomendacao default:** Manter (A) ate Rafael decidir.

**Decisor:** Rafael Feltrim.

---

## 7. Versao canonica das gens (15 papeis)

**Contexto:** Existem 3 versoes paralelas de cada papel:

- `feltrim-agents-base/agents/gem_*.md` v2 (com referencias a marketplaces).
- `Four/Gherkin-Manager_Fase1_Pacote/blueprint_v3_documentacao/.../gem_*.md` v3 (com protocolos).
- `Four/US-Avaliator-CMS 1/FF/_feltrims_framework_docs/_ff_template/.../gem_*.md` v1 (template com placeholders).

**Recomendacao default:** Usar v2 como base (mais rica), aplicar sanitizacao
(remover marketplaces), adicionar referencia explicita aos 8 protocolos do v3.
Templates v1 ficam em `core/agents/_template/skeletons/`. Implementado em PR3.

**Decisor:** Implementacao default - pode ser revisado a qualquer momento.

---

## 8. Pack `feltrim-internal/marketplaces/` - regras operacionais

**Contexto:** Mesma situacao do item 3 mas no nivel de regra: DFS, ANATEL,
prefixos SKU (`DF-`, `MM-`, `UNIV-`).

**Recomendacao default:** ficar em `legacy/feltrim-agents-base-v2/` ate
decisao do item 3.

---

## 9. Brains com aprendizados especificos de projeto

**Contexto:** `feltrim-agents-base/memory/agents/<slug>/brain.md` (13 brains)
podem conter aprendizados de marketplaces, CVP/SIAS ou genericos.

**Recomendacao default:** SPLIT:

- Brains de papeis genericos (beatriz-tl, camila-devops, joao-backend, etc)
  vao para `core/memory/agents/<slug>/brain.md` apos sanitizacao.
- Brains CVP/SIAS vao para `packs/cvp-sias-qa/brains/<slug>/brain.md`.

Implementado em PR4 e PR7.

---

## 10. Boot sequence (CLAUDE.md raiz)

**Contexto:** O CLAUDE.md original tem boot sequence elaborada com leitura
obrigatoria de MEMORY.md, glob de agents, etc.

**Recomendacao default:** `CLAUDE.md` raiz e ponteiro para `core/CLAUDE.md`,
que mantem o boot. Boot sequence sanitizada (sem referencia a Tiny/ML/Shopee).
Implementado em PR3/PR5.

---

## 11. Politica de ativacao de agentes e economia de token

**Status PR11 (2026-05-16):** IMPLEMENTADO. Falta medir consumo real e
calibrar.

**Contexto:** Feedback real de uso (Maio/2026) apontou que squad atuando
"constante em todo projeto" gera custo de token alto e ritualizacao
indesejada (code review automatico, Sofia CIAO em decisao tatica,
team-call em mudanca de copy). Solucao validada em campo:
filtro por funcionalidade + GP + QA so.

**Hipoteses:**

- (A) Politica explicita com 4 modos (SOLO/PAR/MINI/FULL) + anti-patterns
  por agente + ritual lean + diretrizes de economia. **[IMPLEMENTADO em
  PR11.]**
- (B) Deixar ad-hoc por sessao. [Descartada - gera anti-pattern de novo]
- (C) Limitar tecnicamente por hard cap de tokens. [Descartada para v1 -
  matar contexto pode quebrar handoffs validos]

**Implementado em PR11:**

- `core/docs/AGENT_ACTIVATION_POLICY.md` - 4 modos
- `core/docs/TOKEN_ECONOMY.md` - 7 regras + anti-patterns + tabela modelo/modo
- `core/memory/team-rituals/feature-init.md` - ritual lean
- `core/memory/team-rituals/README.md` - secao "quando NAO convocar FULL"
- 15 gens core - secao "Trigger anti-patterns (quando NAO invocar)"
- `core/docs/SQUAD_INDEX.md` v2.2 - coluna "Quando NAO invocar" + modo
  default em mapa de invocacao
- `examples/example-feature-lean.md` - novo (default para 80%)
- `examples/example-spawn-team-meeting.md` - editado com aviso de custo
- `examples/example-model-benchmark.md` - novo (para benchmark Codex 5.4
  quando lancar)
- `governance/SECURITY_AND_PRIVACY.md` - secao "Consumo de token como
  risco operacional" + severidades T1/T2/T3

**Pendente decisao (proxima rodada):**

- [ ] Medir custo real em USD/mes por modo (PAR/MINI/FULL).
- [ ] Calibrar tabela de modelos sugeridos quando Codex 5.4 publicar.
- [ ] Decidir se cria scoreboard operacional de "agentes convocados x
  contribuiram" por sessao.
- [ ] Avaliar adicao de hard cap de tokens por modo apos 1 mes de
  observacao.

**Decisor:** Rafael Feltrim.

---

## Como contribuir com decisoes

Para resolver qualquer item:

1. Anotar a decisao tomada neste arquivo (riscar a sessao e marcar `RESOLVIDO
   em YYYY-MM-DD: <opcao escolhida> - <quem decidiu>`).
2. Implementar a mudanca em PR proprio (NAO mexer no plano original).
3. Atualizar `README.md` raiz se o mapa do repo mudar.

---

## Resumo da entrega MVP (2026-05-16)

| PR | Conteudo | Status |
|----|----------|--------|
| PR0 | Setup (estrutura raiz, git init, .env.example, README esqueleto, DECISIONS_PENDING, CLAUDE.md, AGENTS.md, LICENSE) | OK |
| PR1 | 8 protocolos core copiados de FF v3 | OK |
| PR2 | 4 docs manifesto/strategy/template + OPERATING_MODEL | OK |
| PR3 | 15 gens core sanitizadas + 3 templates (_template/) | OK |
| PR4 | 11 rituais + 3 templates + 10 brains genericos + 2 templates novos + MEMORY.md indice | OK |
| PR5 | 8 docs canonicos de governanca core (LEVELS, CERTS, UNLOCKS, CHAT->ARTIFACT, PROMOTION, SQUAD_INDEX v2.1, ARQUITETURA, ONBOARDING) | OK |
| PR6 | 6 docs de governanca da empresa (Charter, Hierarchy, Rituals, Promotion, Certification, Security) + README | OK |
| PR7 | Pack cvp-sias-qa: 7 gens + 7 brains + 4 docs + CHANGELOG | OK |
| PR8 | Pack cms-gherkin: 4 prompts + 2 ferramentas + 2 fontes + 1 memoria + 1 padrao + 6 docs + exemplos | OK |
| PR9 | Pack us-avaliator: proposta sanitizada + 14 relatorios sanitizados + CHANGELOG + decisao Laudo V4 registrada | OK |
| PR10 | 5 snapshots legacy com READMEs + 2 examples + .specify/memory/constitution.md generica + fechamento de README e DECISIONS_PENDING | OK |

**Total de arquivos commitados: ~135. Total de linhas: ~20.000+.**

**Origens preservadas intactas** em paths read-only (nenhuma origem
editada nem apagada).

**Flag words em core/, governance/, examples/ e raiz: ZERO** (verificado
via `rg -i` contra a lista de `governance/SECURITY_AND_PRIVACY.md`,
exceto comentarios `<!-- origem: ... sanitizada -->` que sao acceptable
self-documentation).

**Repositorio pronto para uso e evolucao.**
