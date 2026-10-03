# 🔬 Deep Research Hub: Avaliação, Infraestrutura e Governança Agêntica (2026)

Este diretório consolida as investigações aprofundadas conduzidas com **Gemini 3.1 Pro (Raciocínio)** e **Perplexity (Conectores Acadêmicos, Web e GitHub)**, integrando rigor metodológico, reprodutibilidade científica e melhores práticas para orquestração agêntica no ecossistema **Feltrim Agents Onion**.

---

## 📚 Documentos Disponíveis

### 1. [Guia Artificial Analysis AI (2026)](./guia-artificial-analysis-ai.md)
*Tratado completo sobre avaliação comparativa de modelos, métricas econômicas de inferência e reprodutibilidade acadêmica.*
- **Paradigma de Avaliação**: *Intelligence Index (v4.3.2)* com 4 pilares (Agentes 30%, Cognição Geral 30%, Engenharia de Software 20%, Raciocínio Científico 20%).
- **Benchmark Anti-Alucinação**: *AA-Omniscience* (6.000 questões com punição severa para alucinações e recompensa para abstenção calibrada).
- **Economia da Inferência**:
  - *Blended Price* (ponderação real: 70% cache hit, 20% input, 10% output).
  - *Cost per Task* (avaliação de modelos de raciocínio considerando tokens internos de pensamento).
  - *Endpoint Accuracy Index* (risco de quantização agressiva em provedores de baixo custo, variando de 100% até colapso em 51.9%).
- **Infraestrutura e Ferramentas Open-Source**:
  - Framework *Stirrup* para orquestração leve de agentes com MCP e Docker/E2B Sandboxes.
  - *AA-AgentPerf-Local* para profiling térmico, TTFT e largura de banda de VRAM (NVIDIA Quadro vs GeForce RTX vs Apple Silicon).
- **Protocolo FAIR de Reprodutibilidade**:
  - Estrutura imutável de diretórios (`protocol/`, `configs/`, `prompts/`, `schemas/`, `results/`, `CITATION.cff`).
  - Esquema universal de registro telemétrico JSON para todas as execuções de agentes.

---

### 2. [Tratado Antigravity 2.0 e Boas Práticas Scratch](./boas-praticas-scratch-e-antigravity.md)
*Guia definitivo de orquestração autônoma, controle de contexto e engenharia de concorrência inspirada em VMs.*
- **Fundamentos Agênticos no Antigravity 2.0**:
  - **Contexto Mínimo Suficiente**: Prevenção de degradação da janela de contexto enviando apenas objetivos, regras essenciais e critérios de aceite.
  - **Critérios de Parada Anti-Circularidade**: Detecção de loops repetitivos com interrupção e requisição obrigatória de revisão humana.
- **Governança ScratchAcadêmico**:
  - Estrutura de regras versionadas em `.agents/rules/` (`00-project`, `10-architecture`, `20-quality`, `30-security`, `40-git`).
  - **Skills de Divulgação Progressiva** (`SKILL.md`): O agente carrega apenas metadados iniciais e só expande o conteúdo quando estritamente acionado.
- **Segurança e Model Context Protocol (MCP)**:
  - Princípio do menor privilégio: abolição de wildcards `mcp(*)`.
  - Conexões com `read_only=true` para auditoria e diagnóstico.
  - Isolamento estrito de segredos e tokens fora de arquivos versionados.
- **Engenharia de Concorrência & Máquinas de Estado**:
  - Orquestração de inicialização via Single Master (`[INIT_SETUP] and wait` -> `[START_ENGINE]`).
  - Game Loop e Máquinas de Estado Finito (FSM: State, Action, Condition) evitando explosão condicional.
  - Guardrail de execução atômica (Warp Mode / Run without screen refresh com teto estrito de 500ms).
  - Métrica Dr. Scratch e avaliação de pensamento computacional via lógica fuzzy.

---

## 🗺️ Mapeamento Operacional: Da Teoria às Regras Ativas

As diretrizes destes dois documentos não são meros textos consultivos — elas governam diretamente o comportamento do sistema através dos adaptadores Multi-IDE:

| Diretriz Teórica | Regra Ativa no Sistema | Adaptador de Execução |
| :--- | :--- | :--- |
| **Contexto Mínimo Suficiente & Anti-Loop** | [00-project.md](../../.agents/rules/00-project.md) | `.agents/`, `.cursor/`, `.claude/`, `.codex/` |
| **Onion Architecture, FSM & Warp Guardrail (500ms)** | [10-architecture.md](../../.agents/rules/10-architecture.md) | `.agents/`, `.cursor/` |
| **Artificial Analysis, Anti-Alucinação & 21/21 SDET** | [20-quality.md](../../.agents/rules/20-quality.md) | `test-onion.cmd`, `rafael_qa_suite.js` |
| **MCP Menor Privilégio & Zero-Secrets** | [30-security.md](../../.agents/rules/30-security.md) | `core/governance/`, `.env` |
| **Uma Tarefa, Uma Branch & PR Protection** | [40-git.md](../../.agents/rules/40-git.md) | Git hooks, GitHub Actions |
| **Profiling de Latência & VRAM** | [hardware-benchmark](../../.agents/skills/hardware-benchmark/SKILL.md) | `nvidia-smi`, telemetria local |
| **Auditoria de Conformidade Estrutural** | [repository-audit](../../.agents/skills/repository-audit/SKILL.md) | Scripts de validação e CI |
