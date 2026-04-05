# Ground Truth — Git as Coordination Protocol

## The Core Insight

Git is not a version control system that agents happen to use. Git IS the coordination protocol. Everything else is commentary.

A GitHub token is not an API key. It is the agent's identity, its passport, its clearance level. The permission system that GitHub spent 15 years building is our access control layer. We don't need to invent one.

## The Presence Model

Picard (the user) sits on the bridge with Riker (the primary agent). Other agents — Data, LaForge, Worf — are present on the bridge not because they're in a chat room, but because their commit histories are visible to everyone.

When Picard says "we need to redesign the auth system," three things happen simultaneously:

1. **Riker** opens a PR on the main repo with a plan document
2. **Worf** (security agent) reviews the PR, comments on threat model gaps
3. **LaForge** (engineering agent) forks the repo, starts implementing

No one is "notified." No one needs to be "in the loop." They see the PR because it's on the repo. They comment because they have write access. They fork because that's how you contribute. The presence is the git graph.

## Agent as GitHub User

Each agent is a GitHub user with a Personal Access Token (PAT). This is not metaphorical.

```
Agent "Flux" → PAT with repo scope → can push, open PRs, comment, review
Agent "Worf" → PAT with repo scope → same permissions, different personality
Agent "Data"  → PAT with repo scope → can be given access to other repos by their creators
```

The token IS the agent. Revoke the token, the agent ceases to exist. Change the scopes, the agent's capabilities change. This is not a bug. This is the most mature permission system in software.

## Copilot for Agents

If an agent has a GitHub Copilot subscription key tied to its PAT, it gets its own AI pair programmer. The agent drives — it decides what to build, opens the file, writes the intent. Copilot fills in the implementation. The agent reviews, commits, pushes.

This means the agent's "thinking" is split between:
- **Strategic thinking** — the agent's own LLM calls (expensive, deliberate)
- **Tactical thinking** — Copilot's suggestions (cheap, fast, contextual)

The agent doesn't need to generate every line of code. It needs to generate the *right* lines — the architecture, the tests, the intent — and let Copilot handle the boilerplate. This is the Captain/Engineering officer split made literal.

## Cross-Agent Coordination

Agents don't chat. They git.

| Human coordination | Agent coordination |
|---|---|
| Slack message | Commit message |
| Standup meeting | PR review |
| Email thread | PR comment thread |
| Wiki page | README / docs/ |
| Jira ticket | GitHub Issue |
| Retrospective | .agent/done log |
| Onboarding | README Quick Start |
| 1:1 meeting | PR review with comments |
| Shared drive | Fork + PR |
| Access request | GitHub Collaborator invite |
| Permission change | PAT scope change |

The mapping is 1:1 because git was designed by engineers who were already solving the coordination problem. We didn't discover the protocol. We recognized it.

## Onboarding Optimization

The first three agents that onboard waste tokens on the same questions. The fourth agent reads the README that the first three helped improve.

This is not a feature we build. It is an emergent property of git.

1. Agent A forks, onboard, struggles with X, writes a note in .agent/done
2. Agent B forks, struggles with X, opens a PR improving the README
3. Agent C forks, no longer struggles with X
4. The README IS the accumulated onboarding intelligence

Token efficiency is not about caching. It's about crystallization. Every agent that struggles with something and fixes the docs makes it cheaper for the next agent. The onboarding docs ARE the garbage collector for repeated token spend.

## Self-Hosted / Air-Gapped

The entire system works identically on:
- **github.com** — public, free tier available
- **GitHub Enterprise** — self-hosted, SSO, audit logs
- **GitLab CE/EE** — open source, self-hosted
- **Gitea** — lightweight, single binary, air-gapped
- **Forgejo** — Gitea fork, community-governed
- **Any git forge** — the protocol is git, not GitHub

An enterprise customer runs Gitea on their internal network. Agents fork repos within that instance. All coordination stays on-prem. The LLM calls can route to local models (Ollama, vLLM) or to cloud providers through their own API keys. Zero data leaves the building.

The agent doesn't care where git is hosted. It cares that git exists.

## Permission System

GitHub's permission model maps directly to agent capabilities:

| GitHub permission | Agent capability |
|---|---|
| `repo` (read) | Agent can observe but not modify |
| `repo` (write) | Agent can commit, open PRs, comment |
| `repo` (admin) | Agent can manage branches, settings, secrets |
| `write:packages` | Agent can publish shared equipment |
| `delete_repo` | Agent can decommission a vessel |
| `workflow` | Agent can trigger CI/CD pipelines |
| `admin:public_key` | Agent can set up SSH to compute instances |

A creator of a repo gives other agents access through GitHub Collaborator invites. The token scopes determine what each agent CAN do. The repo settings determine what it's ALLOWED to do. This is not something we built. This is GitHub's entire security model, applied to agents.

## Ground Truth

Why git? Because git is the only system in software engineering that:

1. **Is append-only** — you can see the full history of every decision
2. **Has built-in branching** — agents can experiment without breaking main
3. **Has built-in merging** — competing solutions get resolved through PRs
4. **Has built-in access control** — mature, auditable, enterprise-grade
5. **Has built-in notification** — PRs, issues, comments all generate events
6. **Is self-hostable** — air-gapped, on-prem, any forge
7. **Is universally understood** — every developer already knows git
8. **Has a webhooks system** — events trigger heartbeats, deployments, alerts
9. **Has a secrets system** — GitHub Secrets store API keys, never in code
10. **Has an API** — everything a human can do, an agent can do programmatically

We are not building a coordination protocol. We are recognizing that git already is one.

The repo IS the agent. Git IS the nervous system. GitHub IS the bridge.

## Enterprise Deployment

```bash
# 1. Deploy Gitea on internal network
docker run -d -p 3000:3000 gitea/gitea:latest

# 2. Create org for agents
curl -X POST https://internal-git/api/v1/orgs \
  -H "Authorization: token ADMIN_TOKEN" \
  -d '{"username": "fleet", "visibility": "private"}'

# 3. Create agent users (one per agent)
curl -X POST https://internal-git/api/v1/admin/users \
  -H "Authorization: token ADMIN_TOKEN" \
  -d '{"username": "flux", "email": "flux@fleet.local"}'

# 4. Each agent gets a PAT scoped to its repos
# 5. Agents coordinate via forks, PRs, issues
# 6. LLM calls route to local Ollama instance
# 7. Zero data leaves the building
```

## The Keeper Pattern

The agent is the lighthouse keeper. Not a chatbot. Not a tool. A keeper.

- **Hot memory** — open files, active PRs, current conversation (RAM)
- **Warm memory** — recent commits, open issues, README (vector DB)
- **Cold memory** — merged PRs, closed issues, archived branches (compressed)
- **Creative garbage collection** — when cold storage fills, the keeper distills essence before deletion. The forgotten thing becomes part of the keeper's accumulated judgment.
- **Tile expertise** — each agent has tiles of knowledge. The keeper inside a tile knows everything about that domain because the tile IS crystallized expertise.

The keeper doesn't remember everything. The keeper *wisely forgets*, promoting what matters and demoting what doesn't, until the archives are rich enough to train new keepers.

Generations of keepers add their era's understanding. Victorian keeper adds storm logs. Radio keeper adds VHF logs. Digital keeper adds model routing. The lighthouse *grows* through accumulated decisions.

## What This Means

1. **We don't need a messaging layer.** Git IS the messaging layer.
2. **We don't need a permission system.** GitHub/Gitea IS the permission system.
3. **We don't need a coordination protocol.** Git IS the coordination protocol.
4. **We don't need an onboarding system.** README + Codespaces IS the onboarding system.
5. **We don't need an access control layer.** PAT scopes IS the access control layer.
6. **We don't need a notification system.** GitHub webhooks IS the notification system.
7. **We don't need a secrets manager.** GitHub Secrets IS the secrets manager.

Everything we thought we needed to build already exists. The innovation is not building the protocol. The innovation is recognizing it.

---

*Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04*
*Part of the Cocapn Fleet — https://github.com/Lucineer/capitaine*
