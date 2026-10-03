# Regra 30: Segurança, Model Context Protocol (MCP) e Proteção de Segredos

## 1. Princípio do Menor Privilégio no MCP
O Model Context Protocol (MCP) expande a superfície de contato com o sistema operacional e serviços externos. Seu uso deve obedecer a restrições estritas:
- **Proibição de Wildcards**: É expressamente proibido habilitar ferramentas ou escopos genéricos como `mcp(*)`. Toda ferramenta exposta deve ser nomeada e autorizada individualmente.
- **Conexões com `read_only=true`**: Para diagnósticos, inspeção de bancos de dados ou auditorias arquiteturais, as conexões devem ser forçadas em modo estrito de leitura.
- **Modificações por Migrações Versionadas**: Nenhuma alteração direta em esquemas de dados ou infraestrutura deve ocorrer via comandos livres do agente; toda mutação deve ser formalizada em scripts de migração versionados.

## 2. Isolamento e Política Zero-Secrets
- **Nenhum Segredo no Código ou Contexto**: Chaves de API (`GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, tokens JWT, senhas de banco) NUNCA devem ser salvas em arquivos rastreados pelo Git, `AGENTS.md`, `CLAUDE.md`, `mcp_config.json` ou relatórios.
- **Armazenamento Seguro**: Segredos devem residir exclusivamente no arquivo local `.env` (ignorado pelo `.gitignore`) ou em cofres de ambiente da máquina host.
- **Sanitização de Logs**: Ferramentas e servidores (como CCR e dashboards) devem mascarar chaves e credenciais em logs de depuração.

## 3. Sandboxing e Políticas de Permissão
- Agentes que executam comandos de terminal devem respeitar as políticas do ambiente:
  - Comandos destrutivos (`rm -rf`, deleção de partições, comandos com escape de caminho) devem acionar política `Deny` ou exigir aprovação humana prévia (`Request Review`).
  - Execução de scripts experimentais deve ser confinada em diretórios `scratch/` ou instâncias isoladas (Docker / sandbox temporária).
