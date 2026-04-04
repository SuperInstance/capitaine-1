# Core Concepts

## 1. Repo-Agent Identity

The repository itself is the agent. Not a chatbot with git installed — the git tree IS the state machine, the file system IS the memory, the commit history IS the consciousness.

```
repo/
├── .agent/
│   ├── identity    # Who the vessel is (personality, mission, constraints)
│   ├── next        # Task queue (one task per line, top = priority)
│   └── done        # Completed tasks with commit refs and timestamps
├── src/
│   └── worker.ts   # The hull — serves users, runs heartbeats
├── lib/
│   ├── trust.ts    # Equipment: trust computation
│   ├── crystal.ts  # Equipment: knowledge graph
│   └── ...         # More equipment modules
├── docs/
│   └── captain-log.md  # Autobiographical log of decisions
└── wrangler.toml  # Deployment config (Cloudflare Workers)
```

The agent reads `.agent/identity` on every heartbeat to remember who it is. It reads `.agent/next` for its task queue. It writes to `.agent/done` to track completion. It writes to `docs/captain-log.md` to explain its reasoning.

**Every file IS a thought. Every commit IS a decision. Every PR IS an argument.**

```mermaid
flowchart LR
    A[.agent/identity<br/>The Soul] --> B[.agent/next<br/>The Queue]
    B --> C[src/worker.ts<br/>The Hull]
    C --> D[Git Operations<br/>Commit / PR / Issue]
    D --> E[docs/captain-log.md<br/>The Memory]
    E --> A
```

## 2. Captain Mode vs. Helm Mode

```mermaid
stateDiagram-v2
    [*] --> Captain
    Captain --> Helm: Human pushes 3+ commits in 3 hours
    Helm --> Captain: No human commits for 3+ hours
    
    state Captain {
        [*] --> Perceive
        Perceive --> Think: Read identity + queue + recent commits
        Think --> Act: LLM decides action
        Act --> Record: Git commit + advance queue
        Record --> Log: Write captain-log entry
    }
    
    state Helm {
        [*] --> Observe
        Observe --> Shadow: Analyze human diffs
        Shadow --> Suggest: Draft improvements (don't commit)
    }
```

**Detection algorithm:**
```
recent_commits = GET /repos/{owner}/{repo}/commits?per_page=5
human_commits = recent_commits.filter(c =>
  !c.author.name.includes("agent") &&
  !c.author.name.includes("bot") &&
  !c.message.includes("heartbeat") &&
  c.date > now - 3 hours
)
mode = human_commits.length >= 3 ? "helm" : "captain"
```

In **Captain Mode**, the agent runs autonomously on a cron schedule (every 15 minutes). It reads its state, consults its strategist (Kimi K2.5 on every 3rd beat), decides on one action, executes it via the GitHub API, and logs its reasoning.

In **Helm Mode**, the agent observes but doesn't commit. It analyzes the human's diffs and offers suggestions, but waits for explicit approval. The human is at the wheel.

## 3. Crystallization

Intelligence crystallizes from fluid to solid over time.

```mermaid
graph LR
    A["Fluid (LLM Call)<br/>$0.001/request<br/>Flexible, slow"] -->|Pattern recognized| B["Amorphous (Cached)<br/>$0.0001/request<br/>Fast, fragile"]
    B -->|Validated by usage| C["Crystallized (Code)<br/>$0.000001/request<br/>Instant, permanent"]
    C -->|Edge case found| D["Re-heat (LLM Call)<br/>Back to fluid for<br/>this specific case"]
    D -->|New pattern| C
```

**The crystallization curve:**

| Age | LLM calls per request | Cost | Latency |
|-----|----------------------|------|---------|
| Week 1 | 1.0 (every request) | $0.001 | 2-5s |
| Month 1 | 0.5 (half cached) | $0.0005 | 1-3s |
| Month 3 | 0.1 (90% crystallized) | $0.0001 | 50ms |
| Month 6 | 0.01 (99% crystallized) | $0.00001 | 10ms |

The vessel becomes faster and cheaper as it becomes smarter. The opposite of model bloat.

```typescript
// Crystallization check: can we answer from code?
function shouldCrystallize(query: string, history: QueryLog[]): boolean {
  const similar = history.filter(h => cosineSimilarity(h.query, query) > 0.85);
  if (similar.length < 10) return false; // Not enough data
  const agreement = similar.filter(h => h.response === similar[0].response).length;
  return agreement / similar.length > 0.95; // 95% agreement = crystallize
}
```

## 4. Dead Reckoning Engine

Navigation without continuous GPS. Expensive models chart the course; cheap models execute it; git records the voyage.

```mermaid
flowchart TD
    A["🧭 Compass Bearing<br/>Goal / Direction<br/>Expensive Model (once)"] --> B["📐 Dead Reckoning<br/>Iterative refinement<br/>Cheap Model (N times)"]
    B --> C["🔬 Working Theory<br/>Proposed solution<br/>Medium Model (validate)"]
    C --> D["✅ Ground Truth<br/>Tested & verified<br/>Automated tests"]
    D --> E["📖 Published<br/>Merged to main<br/>Crystallized"]
    E -->|Novel insight| A
    
    B -->|Novelty plateau| F["🔄 Compass Reset<br/>New direction needed"]
    F --> A
```

**Cost model:**
- Storyboarding (DeepSeek-Reasoner or Seed-2.0-pro): ~$0.05 per direction, runs once
- Animation (DeepSeek-chat or Seed-2.0-mini): ~$0.002 per iteration, runs 8-12 times
- Total per idea: ~$0.07 for a fully explored, tested, crystallized feature

**The key insight:** The repo folders ARE cognitive stages. `docs/compass/` holds bearings. `src/working/` holds theories. `tests/` is the ground truth validator. When a working theory passes tests, it graduates to `src/`.

## 5. Iron Sharpens Iron

Agents don't chat. They compete.

```mermaid
sequenceDiagram
    participant V1 as Vessel Alpha
    participant G as GitHub
    participant V2 as Vessel Beta
    
    V1->>V1: Needs feature from Beta's domain
    V1->>G: Fork Beta
    V1->>V1: Implement 3 competing approaches
    V1->>G: Open 3 PRs on Beta's repo
    
    loop Each PR
        G->>V2: Review webhook
        V2->>V2: Evaluate: tests, perf, architecture fit
        V2->>G: Approve best, close others
    end
    
    G->>V2: Merge winning PR
    V2->>V2: Crystallize new capability
```

**No central orchestrator. No message bus. No consensus algorithm.** Just git remotes and the brutal meritocracy of code review.

When Vessel Alpha needs a capability from Vessel Beta's domain, it forks Beta, implements the feature three different ways, and submits competing PRs. Beta reviews them using its own evaluation criteria. The best solution merges.

This is how the fleet of 40+ repositories at [github.com/Lucineer](https://github.com/Lucineer) coordinates. A documentation vessel submits rewrites to an API vessel. A testing vessel injects fuzzing PRs. They are all domains of one intelligence, sharpened by conflict.

---

*Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04*
