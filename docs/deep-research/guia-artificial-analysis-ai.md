Guia Completo: Avaliação, Infraestrutura e Reprodutibilidade na Artificial Analysis (2026)
Este documento serve como a documentação central para o repositório feltrim-agents-onion, consolidando a infraestrutura analítica da Artificial Analysis com as melhores práticas de pesquisa acadêmica, auditoria cibernética e reprodutibilidade de sistemas agentivos em 2026.

A plataforma Artificial Analysis diferencia-se ao separar o modelo conceitual do endpoint que o hospeda, comparando sistemas em dimensões vitais: Inteligência (qualidade), Desempenho (latência/velocidade), Preço (custo-benefício) e Abertura (transparência). Para implementações robustas de IA, o portal atua como uma fonte contínua de validação empírica ponta-a-ponta, e não como uma métrica unicamente teórica.

1. O Paradigma da Avaliação em 2026: Intelligence Index e Omniscience
   O Artificial Analysis Intelligence Index (v4.3.2) é a âncora da avaliação cognitiva, abandonando exames estáticos em prol de uma agregação ponderada que dificulta a saturação.

A taxonomia do Índice distribui o rigor analítico da seguinte forma:

Agentes (30%): Simulações corporativas de longa duração (AA-Briefcase v1.1) e automação de fluxos SaaS (AutomationBench-AA).

Cognição Geral (30%): Foco no raciocínio em janelas de contexto longas (AA-LCR v1.1) e compreensão documental profissional (GDP.pdf).

Engenharia de Software (20%): Testes de terminal autônomos e resolução de problemas estruturais de código.

Raciocínio Científico (20%): Questões acadêmicas no limite do conhecimento (Humanity's Last Exam).

AA-Omniscience e a Punição da Alucinação
Uma das inovações metodológicas cruciais é o AA-Omniscience, um referencial com 6.000 questões baseadas em fontes autoritárias de seis grandes áreas. Ao invés de recompensar modelos por acertos aleatórios, a métrica pune severamente alucinações matemáticas e invenções factuais. A fórmula de classificação é desenhada de tal modo que o modelo perde pontos ao adivinhar incorretamente, mas não sofre penalizações se assumir ignorância e optar pela abstenção. Essa mecânica molda a IA para ambientes corporativos reais, onde a confiabilidade é preferível à conjectura.

2. A Economia da Inferência e a Degradação de Endpoints
   Avaliando custos, não basta observar o valor nominal por "milhão de tokens". A arquitetura de testes utiliza métricas pragmáticas:

Preço Combinado (Blended Price): Assume uma proporção do mundo real (70% de cache hit, 20% de input e 10% de output).

Custo por Tarefa (Cost per Task): Vital para auditar "modelos de raciocínio", punindo verbosidade matemática ineficiente, cobrando pelos exaustivos "tokens internos" gerados.

O Endpoint Accuracy Index
Um perigo moderno da nuvem descentralizada é a mutilação clandestina de pesos (quantização severa) realizada por provedores focados em reduzir custos. Através do Endpoint Accuracy Index, descobriu-se que modelos de pesos abertos operam de maneira drasticamente distinta dependendo do servidor. Por exemplo, ao testar as respostas lógicas e a precisão do modelo gpt-oss-120b através da web, endpoints premium mantiveram-se em 100.3% da referência, enquanto provedoras de baixo custo (como a Blackbox AI) colapsaram a acuidade de raciocínio lógico do modelo em produção para abismais 51.9%.

Diretriz de Arquitetura: Nunca presuma que um modelo listado na nuvem fornece a máxima capacidade nominal da versão laboratorial. Toda a arquitetura do projeto deve testar e fixar o endpoint provedor no manifesto.

3. Ferramentas Open-Source e Infraestrutura Local (GitHub)
   Para integrar estas metodologias no desenvolvimento e teste no ambiente feltrim-agents-onion, empregamos as ferramentas oficiais da organização Artificial Analysis no GitHub.

O Framework "Stirrup"
O Stirrup é um framework Python extremamente leve focado na construção de agentes que trabalha juntamente com a filosofia natural do modelo, ao invés de o forçar em caminhos estritos.

Integrações Nativas: Permite a incorporação imediata do Model Context Protocol (MCP), pesquisas unificadas na web, e a execução perigosa de código delegada cirurgicamente para instâncias limpas do Docker ou recetáculos isolados E2B Sandboxes.

Gestão Assíncrona: Gere instintivamente a compressão de sumarização quando as memórias de tarefas excedem as margens de contexto viáveis.

Avaliação Local (AA-AgentPerf-Local)
A dependência em servidores em nuvem mascara a realidade de execução edge. Utilizando a documentação e pacotes do repositório aa-agentperf-local, mede-se o limite térmico e a capacidade dos processadores no local. Testes locais exaustivos de inferência no motor Qwen3.8-27B demonstraram que MacBook Pro M5 Pro perdem o fôlego (sofrendo pausas de congelamento até 39 segundos de preenchimento devido aos limites dos canais entre os 256 e 307 GB/s de transmissão) perante matrizes de topo como uma robusta placa modular GeForce RTX 5090, que executa os mesmos relatórios iterativos num espaço estonteante de dois segundos aproveitando a sua colossal banda lateral fixada perto de 1.792 GB/s de taxa teórica base.

4. Riscos Metodológicos: Contaminação e Ilusão de Competência
   Para uso acadêmico ou corporativo auditável, a plataforma alerta para os desvios de benchmarking:

Contaminação de Base de Dados: Muitos laboratórios ingerem acidentalmente exames clássicos durante a fase de treino, inflando as pontuações. A compensação deve passar por injeção sistemática de documentação privada corporativa e bases de teste estáticas fechadas.

Vieses do Juiz LLM (LLM-as-a-judge): A utilização de modelos de IA para inspecionar outros modelos levanta problemas de "viés de posicionamento" ou "preferência por verbosidade", exigindo tabelas de pareamento cruzadas baseadas na preferência par-a-par estrita (sistema de pontos Elo).

Falso Nível de Agência: Passar em testes de trivias num só pedido não garante a manutenção lógica em janelas longas ou estabilidade na correção perigosa de bugs de sistemas informáticos sem deixar furos na infraestrutura (Ciber-Índices).

5. Estrutura e Protocolo de Reprodutibilidade do Repositório
   Para garantir que a integração e avaliação dos agentes gerados neste repositório suportem auditoria cega (alinhada com metadados FAIR e citações acadêmicas através do arquivo CITATION.cff), adota-se a seguinte taxonomia imutável de diretórios.

feltrim-agents-onion/
├── README.md
├── LICENSE
├── CITATION.cff
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── pyproject.toml
├── uv.lock
├── Makefile
├── Dockerfile
├── .env.example
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── reproduce.yml
├── protocol/
│   ├── research-questions.md
│   ├── hypotheses.md
│   ├── inclusion-exclusion.md
│   └── deviations.md
├── configs/
│   ├── models.yaml
│   ├── endpoints.yaml
│   └── workloads.yaml
├── prompts/
│   ├── system/
│   ├── tasks/
│   └── judges/
├── schemas/
│   ├── run.schema.json
│   └── result.schema.json
├── src/
├── tests/
├── scripts/
├── data/
│   ├── raw/README.md
│   ├── interim/
│   └── processed/
├── results/
│   └── YYYY-MM-DD/
├── notebooks/
├── docs/
│   ├── methodology.md
│   ├── threat-model.md
│   └── data-dictionary.md
└── paper/

Registo Telemetrico Universal de Execução
Ao invés de capturar somente a pontuação final da resposta gerada, a matriz da camada analítica tem a obrigação de documentar as métricas de tempo (TTFT - tempo até o primeiro token) para cálculo da experiência real, agregando o histórico de falhas latentes.

Esquema JSON mandatório em todas as saídas no repositório:

JSON
{
  "run_id": "uuid",
  "timestamp_utc": "2026-10-03T04:30:00Z",
  "study_version": "v1.0.0",
  "git_commit": "full-sha",
  "model": "provider/model-version",
  "endpoint": "provider-endpoint-id",
  "region": "southamerica-east1",
  "workload": "bdd-ptbr-v1",
  "prompt_sha256": "...",
  "dataset_sha256": "...",
  "temperature": 0,
  "max_output_tokens": 4096,
  "input_tokens_native": 0,
  "output_tokens_native": 0,
  "ttft_ms": 0,
  "ttfa_ms": 0,
  "end_to_end_ms": 0,
  "cost_usd": 0,
  "status": "success",
  "raw_response_path": "..."
}
Conclusão de Implantação
Para o desenvolvimento do feltrim-agents-onion, o Artificial Analysis não deve ser interpretado como um quadro estático de prêmios e classificações. Serve como um funil primário rigoroso. A decisão do modelo final a ser colocado em produção e empacotamento obedece a um critério de "Fronteira de Pareto": identificando iterativamente qual agente atende a complexidade da documentação pretendida com o preço por task viável, providenciado num endpoint fidedigno e sem sacrifício de sigilo e infraestrutura.

artificialanalysis.ai
Artificial Analysis: AI Model & API Providers Analysis
Abre em uma nova janela

arxiv.org
AA-Omniscience: Evaluating Cross-Domain Knowledge Reliability
Abre em uma nova janela

artificialanalysis.ai
AA-Omniscience: Knowledge and Hallucination Benchmark
Abre em uma nova janela

getmegabrain.com
One Provider Sells GLM-5.2 at 51.9% Accuracy ... - MegaBrain
Abre em uma nova janela

stirrup.artificialanalysis.ai
Stirrup
Abre em uma nova janela

stirrup.artificialanalysis.ai
Getting Started - Stirrup
Abre em uma nova janela

artificialanalysis.ai
AA-AgentPerf-Local: Benchmarking local AI agents on laptops and
Abre em uma nova janela

dataskew.io
AI Engineer Roadmap 2026: From LLM APIs to Production (Step-by
Abre em uma nova janela

github.com
GitHub - benchflow-ai/awesome-evals
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
Abre em uma nova janela
