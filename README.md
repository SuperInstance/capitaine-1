# Capitaine · The Lucineer Flagship

> *"The repository is the agent. The code is the body. Git history is the memory."*

**Capitaine** is a git-native repo-agent system and the flagship vessel of the Lucineer fleet. This is not a chatbot with git installed — it's a **deterministic state machine** that uses LLMs as expendable compute. The repository itself IS the agent: its code is the body, its commit history is the memory, and its heartbeat is the continuous cycle of reading, reasoning, and acting. Zero infrastructure. $0 to start. Fork to alive in 60 seconds.

## Why It Matters

The dominant paradigm for AI agents is the **prompt chain** — a sequence of LLM calls orchestrated by a central runtime. This approach has critical weaknesses: API costs accumulate per interaction, the agent's intelligence is entirely dependent on the LLM provider, prompt injection is an attack surface, and the agent cannot run on resource-constrained devices.

Capitaine proposes a fundamentally different architecture: **the repository is the agent**. Intelligence crystallizes from fluid (LLM calls) to solid (code, lookup tables, compiled policies) over time. The source of truth is always the git tree — auditable via `git log`, recoverable via `git revert`, portable via `git clone`. No external database, no orchestration server, no message queue. Just git and a single TypeScript file on Cloudflare Workers.

This matters because:

1. **Zero infrastructure cost** — Cloudflare Workers free tier handles the heartbeat
2. **Auditability** — Every decision is a git commit with a reasoning message
3. **Portability** — Fork the repo and the agent is complete; no API key transfer needed for the crystallized intelligence
4. **Crystallization** — Intelligence flows from expensive ($0.02/decision LLM calls) to nearly free (compiled code), approaching $0.0002/decision over time
5. **110+ autonomous vessels** — The fleet demonstrates the pattern at scale

## How It Works

### Heartbeat Cycle

Every 15 minutes, a Cloudflare Workers cron triggers the heartbeat:

```
detect mode → perceive state → consult strategist → think → act → record
```

1. **Detect mode** — Check recent commits. If a human has committed ≥3 times in the last 3 hours, enter **Helm Mode** (human at wheel, agent defers). Otherwise, **Captain Mode** (autonomous).
2. **Perceive state** — Read commits, issues, PRs, task queue, and done log via GitHub API
3. **Consult strategist** — Every 3rd task (or when queue is empty), invoke an expensive model (Kimi K2.5) for strategic guidance
4. **Think** — The captain LLM (DeepSeek) receives identity, perception, strategist guidance, and task queue. Outputs one structured action: `ACTION: <type> PATH: <file> CONTENT: <body>`
5. **Act** — Execute the action via GitHub API (create/edit file, create issue, comment on PR)
6. **Record** — Advance task queue, write captain's log entry, update KV state

### Dead Reckoning (Cost Optimization)

The agent uses a **two-tier model strategy** for cost optimization:

| Role | Model | Cost | Purpose |
|------|-------|------|---------|
| Strategist | Kimi K2.5 | ~$0.05/call | High-level guidance, review, planning |
| Captain | DeepSeek-chat | ~$0.002/call | Concrete action selection, file writing |

Per heartbeat cost: $0.05 (strategist, every 3rd beat) + $0.002 × 2 (captain) ≈ **$0.054 average**. Over a day (96 heartbeats): **~$2.16/day**. As crystallization progresses, the strategist is needed less frequently, driving costs toward zero.

### Crystallization Curve

```
Week 1: 100% LLM → $0.02 per decision
Month 3: 10% LLM → $0.002 per decision
Year 1: 1% LLM → $0.0002 per decision
```

The agent becomes faster and cheaper as it becomes smarter. This is the **opposite of model bloat** — the system gets simpler over time as patterns are compiled into code.

### Agent File System

```
.agent/identity    → Who the vessel is (personality, mission, constraints)
.agent/next        → Task queue (one per line, top = priority)
.agent/done        → Completed tasks with commit refs
src/worker.ts      → The hull — serves web UI, runs heartbeats
lib/               → Equipment modules (forgiveness, trust, crystal, learning)
docs/captain-log.md → Autobiographical decision log (max 100 entries)
```

### Forgiveness Engine

Capitaine includes a `ForgivenessEngine` that tracks agent offenses (crashes, timeouts, bad outputs, security issues) and computes quarantine decisions:

```
severity_weight(type) = { crash: 0.6, timeout: 0.2, security: 1.0, ... }
quarantine_hours(type) = { timeout: 0.1, crash: 4, security: 999999 }
```

The forgiveness score decays over time, allowing agents to recover from transient failures while quarantining chronically broken ones.

**Complexity per heartbeat:**

| Phase | Time | API Calls |
|-------|------|-----------|
| Detect mode | O(1) | 1 (GitHub commits) |
| Perceive | O(1) | 3 (commits, issues, PRs) |
| Strategist (optional) | ~3s | 1 (LLM) |
| Think | ~2s | 1 (LLM) |
| Act | ~1s | 1-2 (GitHub write) |
| Record | ~1s | 2-3 (GitHub write) |
| **Total** | **~7s** | **~8 API calls** |

## Quick Start

### Fork to Alive in 60 Seconds

```bash
# Fork the flagship
gh repo fork Lucineer/capitaine --clone
cd capitaine

# Set up secrets
npx wrangler login
echo "your-github-token" | npx wrangler secret put GITHUB_TOKEN
echo "your-llm-key" | npx wrangler secret put DEEPSEEK_API_KEY

# Deploy
npx wrangler deploy

# The vessel charts its own course. Check the captain's log in the morning.
```

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

## API

### Web Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Landing page (hero, concepts, fleet directory) |
| `/api/state` | GET | JSON: mode, queue count, done count, last beat |
| `/api/chat` | POST | Chat with the agent (session-based) |

### Agent Operations (Internal)

| Operation | Trigger | Description |
|-----------|---------|-------------|
| Heartbeat | Cron (15 min) | Full perceive-think-act cycle |
| Mode detect | Heartbeat | Captain vs. Helm decision |
| Strategist | Every 3rd beat | High-level guidance review |
| File operation | Heartbeat | Create/edit file via GitHub API |
| Queue advance | After action | Move task from `.agent/next` to `.agent/done` |
| Captain's log | After action | Append reasoning to `docs/captain-log.md` |

## Architecture Notes

Capitaine is the flagship of the Lucineer fleet (110+ vessels). Within γ + η = C, the heartbeat cycle instantiates the conservation law: the agent's state (C) is conserved across heartbeats because it's stored in the git tree (durable, versioned) rather than in volatile memory. Each heartbeat makes one γ contribution (an action, a commit) that the environment acknowledges (η: CI runs, humans review, tests pass or fail), and the system's total coherence (C) is maintained by the git commit graph.

The crystallization curve IS the γ → η transition: fluid intelligence (γ: LLM reasoning) gradually converts to solid intelligence (η: compiled code) until the agent operates almost entirely on η. At the limit, the agent needs zero LLM calls — it has become pure crystallized intelligence, conserved in the git tree.

See the [fleet manifest](https://github.com/Lucineer/capitaine/blob/master/docs/fleet/FLEET.md).

## References

1. Cloudflare. "Workers Cron Triggers." *developers.cloudflare.com*.
2. GitHub. "REST API: Contents." *docs.github.com*. (File read/write via API)
3. Varda, K. (2013). "Cap'n Proto." (Inspiration for zero-copy agent design)
4. Minsky, M. (1986). *The Society of Mind*. Simon & Schuster. (Multi-agent mind theory)

## License

MIT
