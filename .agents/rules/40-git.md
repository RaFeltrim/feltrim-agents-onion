# Regra 40: Fluxo de Trabalho Git, Isolamento de Branches e Proteção da Main

## 1. Princípio "Uma Tarefa, Uma Branch"
- **Isolamento de Contexto Agêntico**: Cada agente ou sessão de trabalho focada em uma demanda específica (issue, refatoração, novo pack) deve operar em uma branch própria:
  - Formato de nomenclatura: `agent/<issue-ou-funcionalidade>` (ex: `agent/observability-dashboard-mvp`).
  - Múltiplos agentes autônomos nunca devem commitar simultaneamente na mesma branch sem isolamento de escopo.

## 2. Proteção Inegociável da Branch `main`
- A branch `main` representa o estado estável, auditado e pronto para produção do ecossistema.
- **Portões Obrigatórios de Integração (Quality Gates)**:
  1. Nenhum commit direto é permitido na `main`.
  2. Pull Requests requerem aprovação humana e resolução de todos os comentários.
  3. Status Checks obrigatórios: aprovação de 100% da suíte de testes (`cmd.exe /c test-onion.cmd`), lint e validação estática.
  4. Revisão de arquitetura em arquivos de governança, `core/` ou `01-domain/` requer atenção especial de CODEOWNERS.

## 3. Mensagens de Commit Padronizadas
- Commits gerados por agentes devem adotar o padrão *Conventional Commits*:
  - `feat(<escopo>):` nova funcionalidade ou pack;
  - `fix(<escopo>):` correção de bug;
  - `docs(<escopo>):` documentação e pesquisas;
  - `test(<escopo>):` criação ou ajuste de suítes de teste;
  - `refactor(<escopo>):` melhoria interna sem alteração de comportamento externo.
