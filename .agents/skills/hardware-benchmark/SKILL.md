---
name: hardware-benchmark
description: Profiling de hardware local (GPU Quadro T1000, VRAM, RAM do sistema) e auditoria de latência de inferência (TTFT, tok/s, endpoints LM Studio e CCR). Acione ao diagnosticar gargalos de GPU ou planejar carregamento de modelos.
---

# Hardware Benchmark & Profiling Skill

Esta skill guia o agente no monitoramento empírico da infraestrutura de execução local de modelos de IA no ecossistema Feltrim Agents Onion.

## 1. Métricas da GPU NVIDIA Quadro T1000

Para inspecionar a utilização em tempo real, memória VRAM ocupada e temperatura:
```bash
nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv,noheader,nounits
```
- **Capacidade Nominal**: 4.096 MB (4 GB VRAM dedicada).
- **Alocação Típica de Modelos 7B (Q4_K_M)**: ~3.800 MB a 3.920 MB com contexto restrito.
- **Teto Térmico / Alerta**: Temperaturas acima de 80°C exigem redução de concorrência ou pausa.

## 2. Inspeção de Saúde dos Serviços Locais

- **Claude Code Router (CCR)**: Porta `3456`
  ```bash
  curl -s http://127.0.0.1:3456/health
  ```
- **LM Studio Server**: Porta `1234`
  ```bash
  curl -s http://127.0.0.1:1234/v1/models
  ```

## 3. Critérios de Avaliação de Modelos (Artificial Analysis Framework)

- **TTFT (Time to First Token)**: Tempo decorrido do envio do prompt até o primeiro token emitido.
- **Geração de Tokens de Raciocínio**: Modelos como DeepSeek-R1 emitem `reasoning_content` antes da resposta final.
- **Risco de Degradação de Endpoint**: Garantir que o endpoint local não quantize excessivamente o modelo a ponto de colapsar a precisão lógica.
