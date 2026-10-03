# Camada 1: Core Domain (Núcleo Puro)

> **Regra Fundamental de Clean Code**: Esta camada contém as entidades essenciais e regras de negócio invariantes do ecossistema Feltrim Agents. Ela possui **ZERO dependências** de provedores de IA, APIs HTTP, banco de dados ou ferramentas de sistema operacional.

## Conteúdo
- `agents/`: As 15 Gems dos Agentes especializados (identidades, personas, competências e guardrails).
- `governance/`: A Carta da Empresa (COMPANY_CHARTER.md), políticas de promoção, certificação e hierarquia.
- `value-objects/`: Objetos de valor imutáveis (Papéis, Modos de Ativação, Prioridades).
