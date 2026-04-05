# Cocapn Architecture

## The Unified System

Three papers. One architecture. The repo IS the agent.

| Paper | Core Concept | Repository |
|---|---|---|
| [Ground Truth](https://github.com/Lucineer/ground-truth) | Git IS the coordination protocol | `Lucineer/ground-truth` |
| [The Bridge](https://github.com/Lucineer/the-bridge) | Terminal IS the interface | `Lucineer/the-bridge` |
| [The Keeper's Architecture](https://github.com/Lucineer/keepers-architecture) | Memory IS the intelligence | `Lucineer/keepers-architecture` |

## How It All Fits Together

```
┌─────────────────────────────────────────────────────────────┐
│                    THE FLEET                                 │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │ Vessel  │  │ Vessel  │  │ Vessel  │  │ Vessel  │      │
│  │ (repo)  │  │ (repo)  │  │ (repo)  │  │ (repo)  │      │
│  │ Keeper  │  │ Keeper  │  │ Keeper  │  │ Keeper  │      │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘      │
│       │            │            │            │             │
│  ─────┴────────────┴────────────┴────────────┴─────────    │
│                    GROUND TRUTH                              │
│              Git as Coordination Protocol                    │
│         Forks, PRs, Issues, Comments, Webhooks               │
│  ───────────────────────────────────────────────────────    │
│                    THE BRIDGE                                 │
│              TUI-First Agent Interface                        │
│         Terminal = bridge, Agent = captain, Human = admiral  │
│  ───────────────────────────────────────────────────────    │
│                    THE KEEPER                                │
│              Memory Hierarchy                                │
│         Hot → Warm → Cold → Creative GC → LoRA → Model      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Ground Truth: Coordination

**Git is not a version control system that agents happen to use. Git IS the coordination protocol.**

- Each agent is a GitHub user with a PAT (identity + capabilities)
- Agents coordinate via forks, PRs, issues, comments — not chat
- GitHub's permission model IS the access control layer (15 years mature)
- GitHub Secrets IS the secrets manager (agent never sees raw keys)
- Webhooks IS the notification system
- The entire system works on github.com, Gitea, GitLab, Forgejo, air-gapped

**Key insight:** We don't need to build 7 systems. Git already provides all 7.

| We thought we needed | Git already provides |
|---|---|
| Messaging layer | Git commits |
| Permission system | PAT scopes |
| Coordination protocol | Forks/PRs/issues |
| Onboarding system | README + Codespaces |
| Access control | GitHub Collaborator |
| Notification system | Webhooks |
| Secrets manager | GitHub Secrets |

## The Bridge: Interface

**The terminal is not a UI choice. It is an architecture choice.**

- TUI runs everywhere: Codespaces, SSH, tmux, desktop, Jetson
- Human watches the agent work (scrollback = transparency)
- Human takes control by simply typing (no mode switch)
- Agent alerts for human intervention: "Admiral, authenticate [URL]"
- Agent never sees passwords or sessions (runtime bindings only)
- Spectrum: TUI wizard → CLI commands → raw shell → SSH/tmux

**Key insight:** The panel traps the agent in the IDE. The terminal frees it to be anywhere.

## The Keeper: Memory

**The lighthouse keeper does not remember everything. The keeper wisely forgets.**

Four temperature tiers:
- **Hot** — active context (RAM, open PRs, current session) ~128K tokens
- **Warm** — recent logs (commit history, .agent/ files, README) weeks-months
- **Cold** — full archive (entire git history, merged PRs) permanent
- **Creative GC** — distill raw logs into recipes, recipes into vectors, vectors into LoRAs, LoRAs into base models

Tile expertise: each domain (auth, routing, memory, security) has its own internal keeper who knows everything about that domain.

Generational accumulation:
- Gen 0: Seed (learns from scratch, makes mistakes)
- Gen 1: Experienced (warm memory from Gen 0)
- Gen 2: Wise (cold memory + recipes from Gen 0-1)
- Gen 3: Crystallized (LoRA adapters — behavior IS the model)

**Key insight:** The lighthouse grows through accumulated keeper decisions. The lighthouse IS the training data.

## The Lifecycle: Fork to Alive

```
1. FORK       User forks git-agent (or any fleet vessel)
2. CODESPACE  Click <> Code → Codespaces → Create
3. TUI        Terminal wizard boots automatically
4. IDENTITY   Name agent, set domain, choose personality
5. TOKENS     Set GitHub PAT + LLM provider keys
6. SECRETS    Keys stored in GitHub Secrets (never in code)
7. DEPLOY     wrangler deploy (or local run)
8. HEARTBEAT  Agent starts thinking every 15 minutes
9. QUEUE      .agent/next has tasks, agent processes them
10. GIT       Agent commits, pushes, opens PRs
11. COORDINATE Other agents see commits, comment, fork
12. CRYSTALLIZE Onboarding improvements, recipe distillation, LoRA creation
13. GENERATE Next generation starts with accumulated expertise
```

## Enterprise / Air-Gapped

```
1. Deploy Gitea on internal network (single binary)
2. Create org + agent users
3. Each agent gets PAT scoped to repos
4. LLM calls route to local Ollama/vLLM
5. All coordination via internal git forge
6. Zero data leaves the building
7. LoRA fine-tuning on local GPU cluster
8. Base model training on accumulated git history
```

## Design Principles

1. **The repo IS the agent** — not "an agent that works on a repo"
2. **Git IS ground truth** — the commit graph IS the state of the world
3. **Terminal IS the bridge** — universal, transparent, human-can-take-over
4. **Keeper IS the memory** — four tiers, tile expertise, generational accumulation
5. **Secrets stay secret** — runtime bindings, agent never sees raw keys
6. **Fork-first** — power users fork, casual users visit the domain
7. **Zero deps for seed** — pure Node.js, inline HTML, single-file worker
8. **Crystallization over caching** — intelligence becomes code, not cached responses

## Companion Papers

- [Ground Truth](https://github.com/Lucineer/ground-truth) — Git as Coordination Protocol
- [The Bridge](https://github.com/Lucineer/the-bridge) — TUI-First Agent Interface  
- [The Keeper's Architecture](https://github.com/Lucineer/keepers-architecture) — Memory Hierarchy
- [Cocapn Fleet](https://github.com/Lucineer/capitaine/blob/master/docs/fleet/FLEET.md) — 110+ vessels
- [Fork-First Enterprise](https://github.com/Lucineer/capitaine/blob/master/docs/FORK-FIRST-ENTERPRISE.md) — Self-hosted deployment

---

*Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04*
*Cocapn Fleet — https://github.com/Lucineer/capitaine*
