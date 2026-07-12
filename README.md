# Capitaine · The Repo-Native Agent

[![CI](https://github.com/SuperInstance/capitaine-1/actions/workflows/ci.yml/badge.svg)](https://github.com/SuperInstance/capitaine-1/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Workers](https://img.shields.io/badge/runtime-Cloudflare%20Workers-orange.svg)](https://workers.cloudflare.com/)

> *"The repository is the agent. The code is the body. Git history is the memory."*

**Capitaine** is a git-native repo-agent system — not a chatbot with git installed, but a **deterministic state machine** that uses LLMs as expendable compute. The repository itself IS the agent: its code is the body, its commit history is the memory, and its heartbeat is the continuous cycle of reading, reasoning, and acting.

---

## Quick Start

```bash
# Fork to alive in 60 seconds
gh repo fork SuperInstance/capitaine-1 --clone
cd capitaine-1

# Set up secrets
npx wrangler login
echo "your-github-token" | npx wrangler secret put GITHUB_TOKEN
echo "your-llm-key" | npx wrangler secret put DEEPSEEK_API_KEY

# Deploy
npx wrangler deploy
```

The vessel charts its own course. Check the captain's log in the morning.

---

## What It Does

Capitaine proposes a fundamentally different agent architecture: **the repository is the agent**. Intelligence crystallizes from fluid (LLM calls) to solid (code, lookup tables, compiled policies) over time. The source of truth is always the git tree — auditable via `git log`, recoverable via `git revert`, portable via `git clone`. No external database, no orchestration server, no message queue. Just git and a single TypeScript file on Cloudflare Workers.

Every 15 minutes, a Cloudflare Workers cron triggers the heartbeat: detect mode (is a human at the wheel?), perceive state, consult strategist, think, act, and record. The agent uses a **two-tier model strategy** for cost optimization — an expensive strategist model (Kimi K2.5) provides high-level guidance every few beats, while a cheap captain model (DeepSeek) handles concrete action selection. As crystallization progresses, the strategist is needed less, driving costs toward zero.

---

## Architecture

```
detect mode → perceive state → consult strategist → think → act → record
```

### Heartbeat Cycle

1. **Detect mode** — Check recent commits. If a human committed ≥3 times in 3 hours, enter Helm Mode (defer). Otherwise, Captain Mode (autonomous).
2. **Perceive state** — Read commits, issues, PRs, task queue, and done log via GitHub API
3. **Consult strategist** — Every 3rd task, invoke strategist model for guidance
4. **Think** — Captain LLM receives identity, perception, strategist guidance. Outputs one structured action.
5. **Act** — Execute via GitHub API (create/edit file, create issue, comment on PR)
6. **Record** — Advance task queue, write captain's log, update KV state

### Crystallization Curve

```
Week 1: 100% LLM → $0.02 per decision
Month 3: 10% LLM → $0.002 per decision
Year 1: 1% LLM → $0.0002 per decision
```

The agent becomes faster and cheaper as it becomes smarter — the opposite of model bloat.

### Agent File System

```
.agent/identity    → Who the vessel is (personality, mission, constraints)
.agent/next        → Task queue (one per line, top = priority)
.agent/done        → Completed tasks with commit refs
src/worker.ts      → The hull — serves web UI, runs heartbeats
lib/               → Equipment modules (forgiveness, trust, crystal, learning)
docs/captain-log.md → Autobiographical decision log (max 100 entries)
```

### Cost Model

| Role | Model | Cost | Purpose |
|------|-------|------|---------|
| Strategist | Kimi K2.5 | ~$0.05/call | High-level guidance, review, planning |
| Captain | DeepSeek-chat | ~$0.002/call | Concrete action selection, file writing |

Per heartbeat: ~$0.054 average. Per day (96 heartbeats): ~$2.16/day. Decreasing over time via crystallization.

Capitaine is the **flagship agent** of the SuperInstance ecosystem. It uses [FLUX](https://github.com/SuperInstance/flux-runtime) concepts for deterministic computation, connects to [PLATO](https://github.com/SuperInstance/plato-server) for knowledge, and coordinates with other agents via the [git-agent](https://github.com/SuperInstance/git-agent) protocol.

---

## API / Usage

### Web Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Landing page (hero, concepts, fleet directory) |
| `/api/state` | GET | JSON: mode, queue count, done count, last beat |
| `/api/chat` | POST | Chat with the agent (session-based) |

### Configuration (`wrangler.toml`)

```toml
name = "capitaine"
main = "src/worker.ts"
compatibility_date = "2024-12-01"

[triggers]
crons = ["*/15 * * * *"]   # Heartbeat every 15 minutes

[[kv_namespaces]]
binding = "STATE_KV"
id = "your-kv-namespace-id"
```

### Forgiveness Engine

Capitaine includes a `ForgivenessEngine` that tracks agent offenses (crashes, timeouts, bad outputs, security issues) and computes quarantine decisions with time-decay recovery.

---

## Testing

```bash
npm install
npm test
```

---

## Contributing

Contributions are welcome! See the [SuperInstance Contributing Guide](https://github.com/SuperInstance/SuperInstance/blob/main/CONTRIBUTING.md).

---

## Ecosystem

This repo is part of the **SuperInstance** flagship ecosystem — agent-first computation, constraint theory, and self-improving runtimes.

### FLUX Runtime Family

| Repo | Language | Description |
|------|----------|-------------|
| [flux-runtime](https://github.com/SuperInstance/flux-runtime) | Python | Full FLUX runtime: markdown→bytecode, 2037 tests, zero deps |
| [flux-core](https://github.com/SuperInstance/flux-core) | Rust | Register-based bytecode VM, deterministic agent computation |
| [flux-js](https://github.com/SuperInstance/flux-js) | JavaScript | FLUX VM for Node.js and browsers, ~400ns/iter |
| [flux-compiler](https://github.com/SuperInstance/flux-compiler) | Rust/Python | Formal-methods compiler for safety-critical codegen |
| [flux-vm](https://github.com/SuperInstance/flux-vm) | Rust | Stack-based constraint-checking VM, 50 opcodes, Turing-incomplete |

### PLATO Engine Family

| Repo | Language | Description |
|------|----------|-------------|
| [plato-server](https://github.com/SuperInstance/plato-server) | Python | Knowledge tiles, fleet sync via Matrix, HTTP API |
| [plato-engine-block](https://github.com/SuperInstance/plato-engine-block) | Rust | Original room runtime: no_std + alloc, builder pattern |
| [plato-engine-block-c](https://github.com/SuperInstance/plato-engine-block-c) | C99 | Embedded reference: zero heap alloc, bare-metal portable |
| [plato-engine-block-elixir](https://github.com/SuperInstance/plato-engine-block-elixir) | Elixir | BEAM supervision trees, fault tolerance, hot reload |
| [plato-runtime-kernel](https://github.com/SuperInstance/plato-runtime-kernel) | Rust | Spatial model: tensor grid, batons, assertion traps |

### Constraint / Theory Family

| Repo | Language | Description |
|------|----------|-------------|
| [categorical-agents](https://github.com/SuperInstance/categorical-agents) | Rust | Category theory for agent composition (functors, naturality) |
| [cuda-constraint-engine](https://github.com/SuperInstance/cuda-constraint-engine) | CUDA/C | GPU constraint checking at 1B+ constraints/sec |
| [grand-pattern-rs](https://github.com/SuperInstance/grand-pattern-rs) | Rust | Fibonacci dual-direction cellular graph architecture |
| [lau-hodge-theory](https://github.com/SuperInstance/lau-hodge-theory) | Rust | Hodge decomposition, Betti numbers, spectral sequences |
| [ternary-science](https://github.com/SuperInstance/ternary-science) | Rust | Experimental evidence for ternary intelligence, 5 conservation laws |

### Agent / Infrastructure Family

| Repo | Language | Description |
|------|----------|-------------|
| [construct-core](https://github.com/SuperInstance/construct-core) | Rust | Layered trait system: bare-metal → alloc → async agent runtime |
| [crab](https://github.com/SuperInstance/crab) | Bash | Agent shell for repo entry/leave (MUD-room metaphor) |
| [exocortex](https://github.com/SuperInstance/exocortex) | Rust | Persistent cognitive substrate, S3-compatible memory |
| [git-agent](https://github.com/SuperInstance/git-agent) | Python | The repo IS the agent — autonomous lifecycle via Git |
| [capitaine-1](https://github.com/SuperInstance/capitaine-1) | TypeScript | Git-native repo-agent, Cloudflare Workers heartbeat |
| [codespace-edge-rd](https://github.com/SuperInstance/codespace-edge-rd) | Research | Codespace→Edge agent lifecycle and yoke transfer protocols |
| [git-agent-codespace](https://github.com/SuperInstance/git-agent-codespace) | DevContainer | One-click Codespace template for Git-Agent runtimes |

### Registries

| Registry | Package | Install |
|----------|---------|---------|
| **PyPI** | `flux-vm` | `pip install flux-vm` |
| **crates.io** | `fluxvm` | `cargo add fluxvm` |
| **npm** | `flux-js` | `npm install flux-js` |

### Philosophy & Architecture

- 📖 [AI-Writings](https://github.com/SuperInstance/AI-Writings) — Philosophy, essays, and design rationale
- 📦 [PACKAGES.md](https://github.com/SuperInstance/SuperInstance/blob/main/PACKAGES.md) — Full package index

---

## License

MIT
