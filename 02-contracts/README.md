# Camada 2: Contratos & Protocolos (Ports)

> **Regra Fundamental de Clean Code**: Esta camada define as interfaces formais e os protocolos que orquestram a colaboração entre os agentes e o mundo externo. Define **o que** deve ser realizado, isolando o núcleo das implementações concretas de LLMs ou armazenamento.

## Conteúdo
- `protocols/`: Os 8 protocolos sistêmicos (I/O, Handoff, Memory, Runtime Wrapper, Evals, etc.).
- `ports/`: Interfaces abstratas para Provedores de IA, Persistência de Memória e Compiladores.
- `scorecards/`: Matrizes de maturidade e critérios de aceite.
