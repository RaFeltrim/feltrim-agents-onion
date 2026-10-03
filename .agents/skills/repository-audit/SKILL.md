---
name: repository-audit
description: Auditoria técnica de conformidade arquitetural, integridade de contratos e governança Onion. Acione ao validar a estrutura do repositório, integridade de packs ou conformidade com o charter.
---

# Repository Audit Skill (Conformidade Onion & Multi-IDE)

Esta skill guia o agente na auditoria da integridade do repositório **Feltrim Agents Onion**.

## 1. Verificações Mandatórias

1. **Camadas Onion (01 a 04)**:
   - Validar se `01-domain/` não contém imports de `04-infrastructure/`.
   - Confirmar se contratos em `02-contracts/` possuem schemas e protocolos íntegros.
   - Verificar se casos de uso em `03-use-cases/` dependem apenas de contratos abstratos.

2. **Integridade de Packs (`packs/`)**:
   - Todo pack em `packs/<nome>/` deve possuir:
     - `README.md` descritivo.
     - Contratos em `contracts/` ou documento de conformidade.
     - Suíte de testes em `tests/*_test_suite.js`.

3. **Governança Multi-IDE**:
   - Verificar a existência e alinhamento dos adaptadores:
     - `.agents/rules/` (regras canônicas 00 a 40).
     - `.cursor/rules/` (arquivos `.mdc`).
     - `CLAUDE.md` e `AGENTS.md`.

4. **Suíte Automatizada**:
   - Executar:
     ```bash
     cmd.exe /c test-onion.cmd
     ```
   - Garantir 100% de taxa de aprovação (21/21+ testes).

## 2. Emissão de Parecer
Se encontrar inconformidades, documente-as com o caminho do arquivo, regra violada e ação recomendada de remediação.
