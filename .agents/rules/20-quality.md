# Regra 20: Padrões de Qualidade Artificial Analysis e Suíte de Testes SDET

## 1. Paradigma Artificial Analysis (2026)
O ecossistema adota os critérios da plataforma *Artificial Analysis* para avaliação de modelos, endpoints e agentes:
- **Punição Severa de Alucinação (Filosofia AA-Omniscience)**:
  - Modelos em produção são avaliados não por palpites aleatórios, mas pela confiabilidade absoluta.
  - A alucinação factual ou matemática é punida com descarte imediato da saída.
  - O agente deve ser instruído a admitir ignorância ou solicitar esclarecimento quando a informação não estiver disponível nos contratos, sendo essa abstenção calibrada preferível a conjecturas.
- **Fronteira de Pareto em Seleção de Modelos**:
  - Modelos não são escolhidos apenas pelo nome ou benchmark teórico. A escolha deve ponderar a *Fronteira de Pareto*:
    - **Inteligência** (acurácia em testes reais);
    - **Desempenho** (TTFT, latência e vazão em tok/s);
    - **Custo Operacional** (*Blended Price* e *Cost per Task*);
    - **Estabilidade do Endpoint** (prevenção contra quantizações agressivas que degradam capacidade de raciocínio).

## 2. Telemetria e Registro Universal de Execução
Toda execução automatizada, auditoria de modelo ou benchmark deve registrar métricas conforme o esquema canônico:
```json
{
  "run_id": "uuid",
  "timestamp_utc": "2026-10-03T02:00:00Z",
  "model": "deepseek-r1-distill-qwen-7b",
  "endpoint": "lmstudio-local:1234",
  "temperature": 0,
  "ttft_ms": 1250,
  "vram_used_mb": 3913,
  "status": "success"
}
```

## 3. Política de Testes e Aceite SDET
- Nenhuma funcionalidade, pack ou refatoração é considerada concluída sem a execução e aprovação total da suíte integrada:
  ```bash
  cmd.exe /c test-onion.cmd
  ```
- **Taxa Mínima de Aceite**: 100% de testes aprovados (atualmente 21/21+ testes).
- Qualquer regressão ou quebra de contrato de governança bloqueia commits e deploys.
