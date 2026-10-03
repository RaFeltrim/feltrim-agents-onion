# Contrato Operacional: Mvp Starter

## Invariantes Não-Negociáveis
1. **Isolamento de Domínio:** O domínio do Mvp Starter reside estritamente neste pack.
2. **Reuso de Infraestrutura:** Comunicação com LLMs (LM Studio / Gemini) ocorre exclusivamente através do `04-infrastructure/router`.
3. **Decisor Humano:** Todas as entregas de MVP dependem de homologação final do decisor humano.
4. **Zero Segredos:** Nenhuma chave de API ou credencial deve ser persistida nos arquivos deste pack.
