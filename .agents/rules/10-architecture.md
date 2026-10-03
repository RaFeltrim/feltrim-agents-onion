# Regra 10: Arquitetura Onion, Concorrência e Execução Atômica

## 1. Camadas da Arquitetura Onion
O fluxo de dependências deve ser estritamente centrípeto (de fora para dentro). Camadas internas nunca dependem de camadas externas:
1. `01-domain/`: Regras de negócio essenciais, entidades de domínio e value objects imutáveis. Zero dependências externas ou de infraestrutura.
2. `02-contracts/`: Interfaces abstratas (Portas), esquemas de validação (Schemas) e protocolos de comunicação sistêmicos.
3. `03-use-cases/`: Casos de uso de negócio, fluxos de orquestração e gerenciamento de failover.
4. `04-infrastructure/`: Adaptadores concretos de LLM (LM Studio, Google Gemini), banco de dados, roteadores HTTP (CCR) e ferramentas de linha de comando (CLI).

## 2. Orquestração e Concorrência de Agentes
Inspirado nos princípios rigorosos de máquinas virtuais e controle de ticks de execução:
- **Arranque Determinístico (Single-Master Execution)**:
  - Nunca execute múltiplos inicializadores simultâneos sem coordenação.
  - O arranque de subsistemas e packs deve seguir o padrão: `[INIT_SETUP] and wait` seguido de `[START_ENGINE]`, garantindo que todas as dependências estejam estáveis antes do processamento principal.
- **Isolamento de Concorrência & Prevenção de Condições de Corrida**:
  - Agentes paralelos nunca devem modificar os mesmos arquivos concorrentemente sem um orquestrador integrador.
  - Comunicações entre processos devem priorizar chamadas síncronas bloqueantes (`and wait`) ou filas de mensagens com confirmação de entrega (*ACK*).

## 3. Máquinas de Estado Finito (FSM)
Para evitar explosões de lógica condicional (`if/else` aninhados descontrolados):
- Estados globais devem ser controlados por Máquinas de Estado Finito com três categorias claras:
  1. **State (Global/Modo)**: Exclusivo (ex: `BOOTING`, `IDLE`, `PLANNING`, `EXECUTING`, `FAILOVER`). Impede transições inválidas.
  2. **Action (Transacional)**: Operações atômicas permitidas apenas se o Estado Global autorizar.
  3. **Condition (Modificadores)**: Flags e checagens passivas de telemetria ou saúde de endpoints.

## 4. Guardrail de Execução Atômica (Warp Mode Guardrail)
- Operações de processamento pesado, compilação de regras ou consultas síncronas locais (sem renderização de telas intermediárias) devem respeitar um teto temporal estrito de **500 milissegundos** por bloco atômico.
- Operações que excedam esse limite devem introduzir pontos explícitos de pausa/liberação (*yield points* / chamadas assíncronas) para não travar a máquina host nem congelar a comunicação com as IDEs.
