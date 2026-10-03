# Pack: Agent Observability Dashboard

> Dashboard Web de Observabilidade dos Agentes em Tempo Real
> Integrado à Arquitetura de Cebola (*feltrim-agents-onion*).

## Estrutura do Pack

```
packs/agent-observability-dashboard/
├── README.md                                  (Este documento)
├── agents/
│   ├── gem_agent-observability-dashboard_orchestrator.md            (N4 - Orquestrador do Produto)
│   ├── gem_agent-observability-dashboard_developer.md               (N3 - Especialista de Implementação)
│   └── gem_agent-observability-dashboard_qa.md                      (N3 - Auditor de Qualidade e Regras)
├── brains/
│   ├── agent-observability-dashboard-orchestrator/brain.md          (Memória de longo prazo do Orquestrador)
│   ├── agent-observability-dashboard-developer/brain.md             (Memória técnica de implementação)
│   └── agent-observability-dashboard-qa/brain.md                    (Memória de cenários de teste e auditorias)
├── contracts/
│   ├── OPERATING_CONTRACT.md                  (Regras e invariantes não-negociáveis)
│   └── API_IO_SCHEMA.md                       (Contratos de entrada, saída e eventos)
├── docs/
│   ├── ARCHITECTURE.md                        (Visão arquitetural e fluxo de dados)
│   └── CAPABILITY_MATRIX.md                   (Matriz de capacidades e certificações)
└── tests/
    └── agent-observability-dashboard_test_suite.js                  (Bateria de testes automatizados do MVP)
```

## Como Ativar este Pack no Claude Code

```powershell
# Inicie o Claude Code conectado ao ecossistema:
.\start-onion.cmd

# Carregue no prompt:
# "Ativar pack packs/agent-observability-dashboard/README.md e assumir papel de gem_agent-observability-dashboard_orchestrator"
```
