# Security and Privacy - Feltrim Agents Company

> Politica oficial sobre seguranca de dados, segredos, IP de cliente e
> privacidade nos repositorios e packs.

## Principio

```text
Nada que pertenca a cliente ou conte como segredo vai para Git.
Nada que pertenca a outro autor entra como autoral.
Toda exposicao acidental e tratada como incidente critico.
```

## Lista de palavras-bandeira (NUNCA em `core/` nem `governance/`)

Estas palavras NUNCA podem aparecer em `core/`, `governance/`, `examples/`
ou na raiz do repo. Se aparecerem, e bug de sanitizacao - corrigir
imediatamente.

### Clientes do Rafael / projetos cliente

- `CVP`
- `SIAS`
- `Volkswagen`, `VW`
- `Equifax`
- `Santander`
- `BVS`
- `BAP`
- nomes de pessoas internas ao cliente

### Marketplaces / operacao interna do Rafael (so em `packs/feltrim-internal/`)

- `Tiny ERP`, `Tiny`
- `Mercado Livre`, `ML`
- `Magalu`
- `Shopee`
- prefixos SKU especificos: `DF-`, `MM-`, `UNIV-`, `M87B`, `LNTRN18LDS`
- regras: `DFS_BLOCKED`, `DFS_OK`, `ANATEL`, `MIV/SNL/UVZ`

### Tecnologias cliente / proprietary

- `Mainframe SIAS`, `V3Online`
- `bug-capture-sias-automation` (pasta especifica de cliente)
- `Pixel Agents customizado` (instancia especifica do Rafael, nao a
  extensao publica)

### Dados pessoais / segredos

- Qualquer CPF / CNPJ real
- Numeros de telefone reais
- E-mails de cliente / fornecedor / colaborador
- API keys, tokens, passwords
- URLs com credenciais (`https://user:pass@host`)

## Verificacao automatica (pre-commit sugerido)

Comando recomendado antes de cada commit em `core/` ou `governance/`:

```bash
rg -i "(cvp|sias|volkswagen|equifax|santander|bvs|tiny erp|magalu|shopee|m87b|dfs_blocked|miv|snl|uvz)" core/ governance/ examples/ README.md DECISIONS_PENDING.md
```

Resultado esperado: **zero matches** (exceto se for o proprio header de
sanitizacao explicando que foi removido).

Para `packs/cvp-sias-qa/` o resultado vai ter muitos matches - e o pack
delas, e correto.

Para `packs/cms-gherkin/` e `packs/us-avaliator/` o resultado deve ser
**zero**.

## Onde cada coisa pode aparecer

| Palavra-chave | core/ | governance/ | packs/cvp-sias-qa/ | packs/cms-gherkin/ | packs/us-avaliator/ | packs/feltrim-internal/ (futuro) | legacy/ |
|---------------|-------|-------------|--------------------|--------------------|---------------------|----------------------------------|---------|
| CVP/SIAS/Mainframe | NUNCA | NUNCA | OK | NUNCA | NUNCA | NUNCA | OK (em ff-v1, ff-v3-blueprint) |
| Volkswagen/Equifax/Santander | NUNCA | NUNCA | NUNCA | NUNCA | so se sanitizado | NUNCA | OK (em gherkin-manager-fase1) |
| Tiny/ML/Magalu/Shopee | NUNCA | NUNCA | NUNCA | NUNCA | NUNCA | OK | OK (em feltrim-agents-base-v2) |
| Codigos SKU especificos | NUNCA | NUNCA | NUNCA | NUNCA | NUNCA | OK | OK |
| API keys / segredos | NUNCA | NUNCA | NUNCA | NUNCA | NUNCA | NUNCA (vai em .env local) | NUNCA |

## Arquivos NUNCA commitar

Bloqueados pelo `.gitignore` (verificar antes de cada commit):

- `.env`, `.env.local`, `.env.*.local`
- `*.pem`, `*.key`, `*.p12`
- `credentials.json`
- `secrets/`
- `evidence/`, `prints/`, `massas/` (dados de cliente em packs)
- `*-CONFIDENCIAL.*`, `*-PRIVATE.*`
- Test outputs (`test_out.txt`, etc.)

## Procedimento de incidente

Se um segredo ou dado de cliente for commitado por engano:

### Severidade 1 - segredo ativo exposto (API key, password, token)

1. **Imediato:** rotacionar o segredo no provedor (Anthropic, OpenAI, etc.).
2. **Imediato:** revogar a API key exposta.
3. **Em < 1h:** remover do historico do Git (`git filter-repo` ou
   `git filter-branch`), force push se ja foi enviado para remoto.
4. **Em < 1h:** notificar Sofia CIAO + decisor humano.
5. **Em < 24h:** abrir capability review para a gem que commitou.
6. **Em < 7 dias:** atualizar `.gitignore` se houver gap.

### Severidade 2 - dado de cliente exposto (PII, IP)

1. **Imediato:** identificar o cliente afetado.
2. **Em < 1h:** notificar decisor humano (que decide se notifica cliente).
3. **Em < 4h:** remover do repo (do branch principal + historico se for
   publico).
4. **Em < 24h:** auditoria de outras exposicoes semelhantes.
5. **Em < 7 dias:** atualizar palavras-bandeira nesta lista.

### Severidade 3 - referencia a cliente em core/governance (sem dado)

1. **Em < 24h:** abrir PR de sanitizacao.
2. **Em < 7 dias:** revisao de outras referencias.

## IP de terceiros

Material de autoria de terceiros (ver `legacy/gems-external/`) NUNCA entra
em `core/`, `packs/`, ou `governance/` sem:

- Auditoria de origem da autoria.
- Autorizacao de uso (licenca aberta ou contrato).
- Atribuicao explicita ao autor original.

Ate isso ser confirmado, fica em `legacy/gems-external/` com
`IP_PENDENTE.md` como bloqueador.

## Conformidade

- LGPD: se houver dado pessoal de qualquer pessoa identificavel, tratar
  como dado sensivel mesmo que seja "publico".
- GDPR: aplicavel se houver dado de cidadao europeu - tratar com mesmo
  rigor.
- Contratos com cliente: prevalecem sobre esta politica se forem mais
  rigorosos.

## Consumo de token como risco operacional

> Token nao e so dinheiro - e risco operacional. Convocar squad
> completa para uma feature pequena pode 5x-10x o custo sem agregar
> qualidade. Em volume mensal, isso vira blocker de orcamento.

Diretrizes:

- Toda sessao deve usar o **menor modo de ativacao** que resolve a
  tarefa (`core/docs/AGENT_ACTIVATION_POLICY.md`).
- Code review automatico em init de feature: **proibido** por consumir
  token sem necessidade.
- Convocar Sofia CIAO em tarefa tatica: **proibido** por consumir
  modelo premium sem decisao em jogo.
- Convocar agentes "por garantia" ou "pra ouvir opiniao": **proibido**
  por gerar ruido sem decisao.
- Monitorar custo mensal por modelo e por modo. Se houver desvio > 50%
  da media, abrir capability review.
- Quando suspeitar de loop de convocacao redundante (mesma squad
  resolvendo o mesmo tipo de tarefa 3+ vezes), transformar em ritual
  com escopo definido ou gem dedicada (reduz custo recorrente).

Severidade do incidente de token:

| Severidade | Trigger | Acao |
|------------|---------|------|
| **Sev T1** | Sessao unica > 500k tokens em modo PAR/MINI | Pause imediato, revisao da convocacao |
| **Sev T2** | Custo mensal > 2x media historica | Revisao em retro + ajuste de defaults |
| **Sev T3** | Repeticao de anti-pattern (code review automatico, Sofia em tatico) | Atualizar gem que causou + capability review |

Ver `core/docs/TOKEN_ECONOMY.md` para a lista completa de anti-patterns
e diretrizes de modelo por modo de ativacao.

## Auditoria

Sofia CIAO faz revisao mensal de:

- Resultado do grep de palavras-bandeira em core/governance.
- Verificacao de `.gitignore` cobrindo tudo necessario.
- Status do `legacy/gems-external/IP_PENDENTE.md`.
- Incidentes registrados no mes.

Resultado vira retro no proximo hackathon ou em capability review da gem
que causou (se houve incidente).

## Atualizacao desta politica

Mudancas via PR com:

- Aprovacao Rafael Feltrim.
- Aprovacao Sofia CIAO.
- Atualizar `.gitignore` em conjunto se necessario.
- Atualizar lista de palavras-bandeira deste arquivo (em geral so adiciona,
  nao remove).

## Veja tambem

- `.gitignore`
- `DECISIONS_PENDING.md` (item 2 - IP gems-external; item 6 - licenca)
- `LICENSE`
- `legacy/gems-external/IP_PENDENTE.md`
- `core/docs/AGENT_CERTIFICATIONS.md` (cert CHAT-PROMOTION reduz risco de
  exposicao em chat)
