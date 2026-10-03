# Pack: Mvp Starter

> MVP Starter Canônico para Validação e Extensibilidade do Ecossistema
> Integrado à Arquitetura de Cebola (*feltrim-agents-onion*).

## Estrutura do Pack

```
packs/mvp-starter/
├── README.md                                  (Este documento)
├── agents/
│   ├── gem_mvp-starter_orchestrator.md            (N4 - Orquestrador do Produto)
│   ├── gem_mvp-starter_developer.md               (N3 - Especialista de Implementação)
│   └── gem_mvp-starter_qa.md                      (N3 - Auditor de Qualidade e Regras)
├── brains/
│   ├── mvp-starter-orchestrator/brain.md          (Memória de longo prazo do Orquestrador)
│   ├── mvp-starter-developer/brain.md             (Memória técnica de implementação)
│   └── mvp-starter-qa/brain.md                    (Memória de cenários de teste e auditorias)
├── contracts/
│   ├── OPERATING_CONTRACT.md                  (Regras e invariantes não-negociáveis)
│   └── API_IO_SCHEMA.md                       (Contratos de entrada, saída e eventos)
├── docs/
│   ├── ARCHITECTURE.md                        (Visão arquitetural e fluxo de dados)
│   └── CAPABILITY_MATRIX.md                   (Matriz de capacidades e certificações)
└── tests/
    └── mvp-starter_test_suite.js                  (Bateria de testes automatizados do MVP)
```

## Como Ativar este Pack no Claude Code

```powershell
# Inicie o Claude Code conectado ao ecossistema:
.\start-onion.cmd

# Carregue no prompt:
# "Ativar pack packs/mvp-starter/README.md e assumir papel de gem_mvp-starter_orchestrator"
```
