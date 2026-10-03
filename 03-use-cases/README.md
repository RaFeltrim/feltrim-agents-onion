# Camada 3: Casos de Uso & Aplicação (Application Services)

> **Regra Fundamental de Clean Code**: Esta camada orquestra o fluxo de dados entre o Domínio e as Portas de Infraestrutura. Contém os pipelines executáveis e regras de aplicação de negócio.

## Casos de Uso
- `failover-routing/`: Roteamento inteligente de tokens com failover preditivo (>20k tokens).
- `squad-orchestration/`: Convocação e colaboração entre múltiplos agentes conforme `ORCHESTRATION_POLICY`.
- `bdd-compilation/`: Pipeline de compilação de User Stories para especificações Gherkin executáveis.
- `story-refinement/`: Diagnóstico automatizado de qualidade e clareza de requisitos.
