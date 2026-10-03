# Camada 4: Infraestrutura & Adaptadores (Adapters & Tools)

> **Regra Fundamental de Clean Code**: Esta é a camada externa mais volátil. Ela implementa as interfaces definidas em `02-contracts/ports/` utilizando tecnologias e bibliotecas concretas.

## Adaptadores
- `llm-adapters/`:
  - `lmstudio.adapter.js`: Implementa `LLMProviderPort` via LM Studio Local (1234).
  - `gemini.adapter.js`: Implementa `LLMProviderPort` via Google Gemini Cloud API.
- `router/`: Claude Code Router (CCR V10 Engine com injeção de identidade e SSE keepalive).
- `storage-adapters/`: Leitura/escrita no sistema de arquivos para memória persistente.
- `cli/`: Scripts de entrada do usuário (`start-onion.ps1`, `telemetry-onion.ps1`).
