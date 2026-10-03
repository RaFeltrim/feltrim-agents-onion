# Graph Report - feltrim-agents-base  (2026-10-02)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 104 nodes · 138 edges · 8 communities (6 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `23ae7765`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- gerar_artefatos.py
- MODELO-FONTE-ESTRUTURADA.json
- PROJETO-EXEMPLO.json
- sync-models.js
- configure-ccr.js
- patch-ccr.js
- registrar_problema.py

## God Nodes (most connected - your core abstractions)
1. `ModelProbeAnimation` - 9 edges
2. `build_workbook()` - 9 edges
3. `main()` - 6 edges
4. `render_feature()` - 6 edges
5. `testGemini()` - 6 edges
6. `testGroq()` - 6 edges
7. `testLMStudio()` - 6 edges
8. `validate_source()` - 5 edges
9. `main()` - 5 edges
10. `collapse_space()` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (8 total, 1 thin omitted)

### Community 0 - "gerar_artefatos.py"
Cohesion: 0.18
Nodes (22): build_workbook(), collapse_space(), format_bullets(), has_required_steps(), join_lines(), load_source(), main(), normalize_ac_id() (+14 more)

### Community 1 - "MODELO-FONTE-ESTRUTURADA.json"
Cohesion: 0.09
Nodes (21): acceptance_criteria, attention_points, business_problem, business_rules, conclusion, dependencies, feature_description, feature_tags (+13 more)

### Community 2 - "PROJETO-EXEMPLO.json"
Cohesion: 0.09
Nodes (21): acceptance_criteria, attention_points, business_problem, business_rules, conclusion, dependencies, feature_description, feature_tags (+13 more)

### Community 3 - "sync-models.js"
Cohesion: 0.24
Nodes (10): env, fs, main(), ModelProbeAnimation, os, path, saveRouterConfig(), testGemini() (+2 more)

### Community 4 - "configure-ccr.js"
Cohesion: 0.25
Nodes (7): ccrDir, config, configPath, envPath, fs, os, path

### Community 5 - "patch-ccr.js"
Cohesion: 0.25
Nodes (7): ccrDir, cli, cliPath, endIdx, fs, path, startIdx

## Knowledge Gaps
- **60 isolated node(s):** `acceptance_criteria`, `attention_points`, `business_problem`, `business_rules`, `conclusion` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 64 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `acceptance_criteria`, `attention_points`, `business_problem` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `MODELO-FONTE-ESTRUTURADA.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `PROJETO-EXEMPLO.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._