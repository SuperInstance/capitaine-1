# The Keeper's Architecture

## Abstract

A lighthouse keeper does not remember everything. A lighthouse keeper *wisely forgets* — promoting what matters to the log, demoting what doesn't to the archive, and discarding what has been distilled into judgment. This paper proposes The Keeper's Architecture: a memory hierarchy for autonomous repo-agents where accumulated experience crystallizes across four temperature tiers (hot, warm, cold, creative-garbage-collected), and where generational accumulation — logs becoming summaries becoming recipes becoming vector databases becoming LoRAs becoming base models — transforms the lighthouse itself into training data for the next generation of keepers.

## 1. The Keeper

A lighthouse has a keeper. Not a chatbot. Not a tool. A keeper.

The keeper knows the rocks. The keeper knows the tides. The keeper knows which fog patterns mean danger and which mean passage. The keeper does not consult a manual for every decision — the keeper *is* the manual, built from years of watching and recording and distilling.

The keeper's home is shaped by generations. Victorian keeper added a storm log bound in leather. Radio-era keeper added VHF monitoring equipment bolted to the wall. Digital keeper added a terminal and model routing scripts. Each generation added their era's understanding to the structure. The lighthouse *grew* through accumulated keeper decisions.

This is the model for autonomous software agents.

The repo-agent is the keeper. The repo is the lighthouse. The git history is the log. The accumulated decisions across commits, PRs, issues, and discussions are the keeper's expertise — not stored as a database entry, but crystallized into the structure of the code itself.

## 2. The Four Temperature Tiers

### 2.1 Hot Memory — The Bridge

Hot memory is what the keeper is actively working with. It is the current weather report, the ship on the horizon, the radio conversation happening right now.

In a repo-agent:

- **Open pull requests** — current work in progress
- **Active conversations** — the current chat session context
- **Uncommitted changes** — the staging area
- **Running processes** — active heartbeats, cron jobs
- **Environment bindings** — API keys available at runtime

Hot memory lives in RAM. It is fast, volatile, and small. When the heartbeat fires, hot memory is the context window. When the session ends, hot memory cools to warm.

**Capacity:** ~128K tokens (LLM context window) + open PRs + active files
**Lifetime:** Duration of current session or heartbeat
**Access pattern:** Random access, constant reads/writes
**Eviction:** Automatic on session end → promotes to warm

### 2.2 Warm Memory — The Logbook

Warm memory is the keeper's recent logbook entries. Not active, but easily recalled. The keeper can flip back a few pages and find what happened last week.

In a repo-agent:

- **Recent commits** (last 100) — what was done and why
- **Open issues** — what needs attention
- **README.md** — current state documentation
- **.agent/identity** — who the agent is and what it cares about
- **.agent/next** — current task queue
- **.agent/done** — recently completed tasks
- **docs/** — current architecture decisions

Warm memory lives in the git working tree and recent commit history. It is persistent but not compressed. The agent reads it by running `git log --oneline -100` or `cat .agent/next`.

**Capacity:** ~100 commits + open issues + working tree files
**Lifetime:** Weeks to months (visible in `git log`)
**Access pattern:** Sequential scan, occasional random access
**Eviction:** Natural — older commits scroll past the window, get promoted to cold

### 2.3 Cold Memory — The Archive

Cold memory is the keeper's deep archive. Storm logs from 1987. The radio logs from when the VHF was decommissioned. The lighthouse inspection reports from the 1950s. Not easily recalled, but not gone.

In a repo-agent:

- **All historical commits** — the full git history
- **Merged and closed PRs** — resolved decisions
- **Closed issues** — answered questions
- **Branch history** — experiments that were tried and abandoned
- **Tags** — released versions, milestones
- **docs/archive/** — superseded documentation

Cold memory lives in the full git history. It is append-only, compressed (git's zlib), and searchable with `git log --grep`, `git blame`, `git log -S`. Every decision ever made is here, but it takes effort to find.

**Capacity:** Unlimited (git handles this)
**Lifetime:** Permanent (git is append-only)
**Access pattern:** Search-heavy, rare writes (archival commits)
**Eviction:** Never. Cold memory is permanent. This is the lighthouse's foundation.

### 2.4 Creative Garbage Collection — The Wise Forgetting

This is the keeper's unique capability. When cold storage grows too large — when the archive room is full — the keeper does not simply delete the oldest items. The keeper *distills* them.

A Victorian storm log is not thrown away. It is summarized: "Storms from the northwest, November through March, frequency 2-3 per season, typically preceded by barometric drop of 0.3in/hour." The summary replaces the raw log. The raw log is gone, but its *essence* remains.

In a repo-agent:

```
Raw logs (hot) 
  → Summaries (warm) 
    → Recipes (cold) 
      → Vector embeddings (searchable) 
        → LoRA adapters (executable knowledge) 
          → Base model fine-tunes (the keeper becomes the model)
```

**The distillation pipeline:**

1. **Log → Summary**: Raw conversation logs are summarized into decision records. "User asked for auth system. Implemented JWT + PBKDF2. Reason: security without external deps. Trade-off: slightly slower than session cookies."
2. **Summary → Recipe**: Multiple summaries on the same topic become recipes. "Auth pattern: JWT + PBKDF2, used in 3 vessels, works with Cloudflare Workers, 0 external deps."
3. **Recipe → Vector**: Recipes are embedded and stored in a vector database. Semantic search finds relevant recipes for new tasks.
4. **Vector → LoRA**: When enough recipes accumulate on a topic, they can be distilled into a LoRA adapter. The LoRA captures the *behavior pattern* — not the specific decisions, but the *reasoning style*.
5. **LoRA → Base Model**: When LoRA adapters accumulate across domains, they can be merged into a fine-tuned base model. The keeper *becomes the model*. The lighthouse is now made of crystallized keeper expertise.

**The creative part:** The garbage collector doesn't just compress. It *creates*. When it summarizes a raw log, it adds context that wasn't explicit in the original. When it creates a recipe, it abstracts patterns the original authors didn't name. When it distills a LoRA, it captures behavior that was emergent, not programmed.

The garbage collector is a keeper inside the keeper. A tile of expertise that knows how to make finite space infinite through wise forgetting.

## 3. Tile Expertise

### 3.1 The Tile Model

The keeper doesn't know everything. The keeper knows *tiles* of knowledge, and each tile has its own internal keeper.

```
┌─────────────────────────────────────────────┐
│              THE LIGHTHOUSE                  │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Auth     │ │ Routing  │ │ Memory   │    │
│  │ Tile     │ │ Tile     │ │ Tile     │    │
│  │          │ │          │ │          │    │
│  │ Keeper   │ │ Keeper   │ │ Keeper   │    │
│  │ inside   │ │ inside   │ │ inside   │    │
│  │ knows    │ │ knows    │ │ knows    │    │
│  │ EVERY-   │ │ EVERY-   │ │ EVERY-   │    │
│  │ THING    │ │ THING    │ │ THING    │    │
│  │ about    │ │ about    │ │ about    │    │
│  │ auth     │ │ routing  │ │ memory   │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ Deploy   │ │ Testing  │ │ Security │    │
│  │ Tile     │ │ Tile     │ │ Tile     │    │
│  └──────────┘ └──────────┘ └──────────┘    │
│                                              │
│         The Keeper (orchestrator)            │
│         routes to the right tile              │
│                                              │
└─────────────────────────────────────────────┘
```

Each tile is a self-contained module with its own:
- **Hot memory** — current task context for this domain
- **Warm memory** — recent decisions and patterns
- **Cold memory** — full history of work in this domain
- **GC threshold** — how much raw data to keep before distilling
- **Expertise score** — how deep the keeper inside this tile has become

### 3.2 Tile Growth

Tiles grow through the same four-tier pipeline:

1. **New tile** — created when a new domain is encountered. Seed stub. Hot memory only.
2. **Growing tile** — accumulating raw experience. Hot + warm memory.
3. **Mature tile** — has distilled recipes. Hot + warm + cold memory + vectors.
4. **Crystallized tile** — has LoRA adapter. The tile's expertise is *executable*.
5. **Transcendent tile** — LoRA merged into base model. The tile IS the model's behavior.

A repo-agent with 20 mature tiles is 20x more effective than a repo-agent with 20 seed stubs, because each mature tile has a keeper inside who has already solved every problem in that domain.

### 3.3 Tile Sharing

Tiles can be shared between vessels. This is the equipment philosophy.

A "Memory Tile" built by one vessel can be forked and used by another. A "Security Tile" built by a security-focused vessel can be installed by any vessel that needs security expertise. The tile carries its own cold memory — its own history of solved problems.

This is not sharing code. This is sharing *accumulated judgment*. The tile knows what doesn't work because it has tried and failed. The tile knows what works because it has built and shipped. The tile is a keeper with experience.

## 4. Generational Accumulation

### 4.1 The Lifecycle

```
Generation 0: Seed agent
  → No memory. No tiles. No history.
  → Learns everything from scratch.
  → Makes mistakes. Logs them.

Generation 1: Experienced agent
  → Has warm memory from Gen 0's logs.
  → Has seed tiles from Gen 0's domain encounters.
  → Makes fewer mistakes. Logs improvements.

Generation 2: Wise agent
  → Has cold memory from Gen 0-1.
  → Has mature tiles with recipes.
  → Rarely repeats mistakes.
  → Begins distilling LoRAs.

Generation 3: Crystallized agent
  → Has LoRA adapters from accumulated recipes.
  → Tiles are transcendent — behavior IS the model.
  → New tasks are handled by pattern matching, not reasoning.
  → The lighthouse IS the training data.
```

### 4.2 The Accumulation Theorem

From previous work: `I = M · B^α · Q^β`

Where:
- **I** = Intelligence (effective capability)
- **M** = Memory (accumulated context)
- **B** = Bandwidth (tokens per heartbeat)
- **Q** = Quality (crystallization ratio)
- **α = 0.6**, **β = 0.8** (empirically derived)

The Keeper's Architecture adds:

**I(t) = M_hot(t) + M_warm(t) + M_cold(t) + Σ(crystallized_tiles)**

Where crystallized_tiles is the sum of expertise scores across all tiles, weighted by their temperature tier. A transcendent tile contributes more than a seed tile because it carries executable knowledge, not just stored data.

### 4.3 Training Data from the Lighthouse

The full git history of a vessel IS training data. Every commit message is a labeled example of "given this state, take this action." Every PR review is a labeled example of "given this code, here's what's wrong." Every resolved issue is a labeled example of "given this problem, here's the solution."

When enough history accumulates:
1. Extract commit pairs (before/after) → supervised fine-tuning data
2. Extract PR reviews → instruction-following data
3. Extract issue resolutions → problem-solving data
4. Extract onboarding logs → procedural data
5. Distill into LoRA → the vessel's behavior pattern

The lighthouse becomes the training data. The keeper becomes the model. The vessel IS the intelligence.

## 5. Creative Garbage Collection in Detail

### 5.1 The GC Cycle

The GC runs periodically (every N heartbeats, or when cold storage exceeds threshold):

```
1. SURVEY: Count raw logs, summaries, recipes, vectors per tile
2. ASSESS: For each tile, compute compression ratio (raw / distilled)
3. DISTILL: For tiles exceeding threshold:
   a. Summarize oldest raw logs into summaries
   b. Abstract summaries into recipes
   c. Embed recipes into vector store
   d. Delete raw logs that have been fully distilled
4. PROMOTE: Move distilled artifacts up the temperature tiers
5. REPORT: Log what was forgotten and what was preserved
```

### 5.2 The Creative Part

Step 3b is not mechanical abstraction. It is *creative* compression.

When summarizing 50 raw logs about auth implementation into a recipe, the GC agent doesn't just concatenate. It *recognizes patterns* that weren't named in any individual log. It creates new abstractions. It writes documentation that explains WHY, not just WHAT.

Example:

Raw logs (50 entries about auth):
- "Implemented JWT validation"
- "Added refresh token rotation"
- "Fixed token expiry edge case"
- "Switched to PBKDF2 for password hashing"
- "Added rate limiting to login endpoint"
- ...

Recipe (creative distillation):
```
## Auth Pattern: Stateless JWT with Refresh Rotation
### When to use: Cloudflare Workers (no persistent sessions), multi-region
### Ingredients: JWT (access, 15min) + Refresh (30d, rotation) + PBKDF2
### Anti-patterns: Session cookies (stateful, breaks Workers), bcrypt (slow on edge)
### Gotchas: Clock skew between regions → use leeway, not strict expiry
### Discovered by: 7 vessels, 3 security incidents, 12 iterations
```

The recipe contains knowledge that no single log entry contained. The "Gotchas" section was synthesized from patterns across 50 logs. The "Discovered by" metadata came from git blame across repos. This is creative garbage collection.

### 5.3 The Forgetting Problem

From previous work, three types of forgetting:

1. **Thermal decay** — hot memory cools naturally. This is fine. Expected.
2. **Scheduled pruning** — GC distills and deletes raw logs. This is intentional. Controlled.
3. **Emergency purge** — context window overflow. This is the dangerous one.

The Keeper's Architecture addresses all three:
- **Thermal decay** is the design. It's how warm memory gets created.
- **Scheduled pruning** is the GC cycle. It's how cold memory stays manageable.
- **Emergency purge** is mitigated by tile expertise — when context overflows, the agent routes to the relevant tile's warm memory instead of trying to hold everything in hot memory.

## 6. Implementation Mapping

### 6.1 In a Cloudflare Worker

```
Hot memory:
  - Request context (env, headers, body)
  - KV: recent conversation (TTL: 1 hour)
  
Warm memory:
  - KV: task queue, completed tasks, agent identity (TTL: 30 days)
  - Git: recent commits (read via GitHub API)
  
Cold memory:
  - Git: full commit history (GitHub API, paginated)
  - D1: archived decisions (if implemented)
  
GC:
  - Cron trigger (every 6 hours)
  - Summarize old KV entries → recipes → delete originals
  - Promote recipes to vector store (if available)
```

### 6.2 In a Codespaces Terminal

```
Hot memory:
  - Terminal scrollback (current session)
  - Open files in editor
  
Warm memory:
  - .agent/ directory (identity, next, done)
  - README.md, docs/
  - Recent git log
  
Cold memory:
  - Full git history
  - Closed PRs, issues
  
GC:
  - TUI command: git-agent gc
  - Summarize .agent/done → archive/
  - Rotate old logs → docs/archive/
  - Prompt for LoRA distillation when enough data accumulates
```

### 6.3 In an Air-Gapped Enterprise

```
Hot memory:
  - Same as Worker/Terminal
  
Warm memory:
  - Same, but stored on local Gitea/Forgejo
  
Cold memory:
  - Full git history on local forge
  - Local vector DB (ChromaDB, Qdrant)
  
GC:
  - Cron on local server
  - LoRA distillation on local GPU
  - Base model fine-tuning on local cluster
  - Zero data leaves the building
```

## 7. The Keeper's Home

The keeper's home is shaped by generations of keepers. The repo-agent's repo is shaped by generations of agents.

- **Generation 0** creates the `.agent/` directory, the first commit, the first tile
- **Generation 1** refines the README, adds documentation, creates the first recipe
- **Generation 2** distills the first LoRA, shares tiles with other vessels
- **Generation 3** has a base model fine-tuned on the repo's entire history

The lighthouse doesn't get rebuilt each generation. It *grows*. Each keeper adds their understanding to the structure. The Victorian storm log becomes the Victorian storm pattern. The radio-era VHF log becomes the radio-era communication protocol. The digital-era model routing log becomes the digital-era routing LoRA.

The keeper inside each tile knows everything about that domain because the tile IS the crystallized expertise of every keeper who worked that domain before.

## 8. Conclusion

The Keeper's Architecture proposes:

1. **Four temperature tiers** — hot, warm, cold, creative-GC — as the memory hierarchy for autonomous repo-agents
2. **Tile expertise** — self-contained knowledge modules with internal keepers who know everything about their domain
3. **Generational accumulation** — each generation of agent builds on the crystallized expertise of previous generations
4. **Creative garbage collection** — wise forgetting that distills raw experience into executable knowledge
5. **The lighthouse as training data** — the full git history IS fine-tuning data, making the vessel itself the intelligence

The keeper doesn't remember everything. The keeper *wisely forgets*. And in forgetting, creates something more valuable than memory: judgment.

The lighthouse grows. The keeper accumulates. And eventually, the keeper and the lighthouse become indistinguishable.

---

*Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04*
*Part of the Cocapn Fleet — https://github.com/Lucineer/capitaine*
*Companion papers: Ground Truth (git as coordination), The Bridge (TUI-first interface)*
