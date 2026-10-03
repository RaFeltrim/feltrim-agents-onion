# Regra 00: Identidade do Projeto, Escopo e Gestão de Contexto

## 1. Identidade e Missão
O **Feltrim Agents Onion** é uma infraestrutura corporativa de engenharia de software baseada em multi-agentes orientada pelo padrão **Clean Architecture / Onion**. O sistema orquestra agentes autônomos para desenvolvimento de software, automação de testes (SDET), QA e observabilidade de inferência local e em nuvem.

## 2. Princípio do Contexto Mínimo Suficiente
- **Não sobrecarregue o contexto**: Agentes e LLMs nunca devem receber cópias desnecessárias do repositório inteiro. O contexto deve conter estritamente:
  1. O objetivo imediato claro e mensurável;
  2. As regras pertinentes da camada em edição;
  3. Os arquivos de entrada e contratos envolvidos;
  4. Os critérios objetivos de aceite e validação.
- **Divulgação Progressiva**: Detalhes e especificações extensas devem ser compartimentados em subarquivos ou *skills*, sendo consultados sob demanda.

## 3. Protocolo Anti-Circularidade
- Se um agente detectar que tentou a mesma ação corretiva duas vezes consecutivas sem sucesso, ou se deparar com erros idempotentes de compilação/teste:
  1. **Interrompa a execução imediatamente**;
  2. Documente a hipótese falha e o erro retornado no scratchpad ou relatório;
  3. Solicite orientação e decisão explícita do operador humano (Soberania Humana).

## 4. Multi-IDE e Coerência Transversal
- As regras contidas neste diretório (`.agents/rules/`) formam a base canônica para todas as IDEs suportadas:
  - **Google Antigravity**: Lê nativamente `.agents/rules/` e `.agents/skills/`.
  - **Cursor**: Adaptado via `.cursor/rules/*.mdc`.
  - **Claude Code**: Adaptado via `CLAUDE.md` e `.claude/`.
  - **Codex / Universal**: Adaptado via `AGENTS.md` e `.codex/`.
- Nenhuma IDE deve divergir das diretrizes arquiteturais e de qualidade aqui estabelecidas.
