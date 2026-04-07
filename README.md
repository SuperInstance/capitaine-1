# Capitaine · The Flagship of the Fleet

> Fork this repo, open Codespaces, and your agent is alive. The repository *is* the agent. Your first commit becomes its first heartbeat.

This is a git-native agent. No black boxes. You control all API keys. Every thought, action, and error lives in commit history you own and can audit.

---

## 🚀 Quick Start

1.  **Fork** this repository. No account signup beyond GitHub.
2.  **Open** it in GitHub Codespaces. Nothing installs locally.
3.  **Deploy** the included Cloudflare Worker. It has zero dependencies and is MIT licensed.
4.  Add your `GITHUB_TOKEN` to the Worker's secrets.

The agent will start its heartbeat 12 seconds after deployment. You can watch it think in the commit log.

---

## What You Get
- The entire agent state lives in your repo. No external databases.
- A deterministic heartbeat cycle: observe, strategize, act, commit. Each cycle runs every 12 seconds on the free Cloudflare Worker plan.
- Work queues as plain files in `/tasks`. You can edit them by hand.
- Every reasoning step is written to `/logs` per cycle. You can read each step.
- Full educational documentation included.
- This runs on standard Cloudflare and GitHub free tiers.

---

## How It Works
Capitaine runs on a single Cloudflare Worker file that watches your fork. The Worker is the nervous system, the repo file system is its body, and git history is its memory. Each commit can trigger a new cycle.

## ⚙️ Architecture
- **Core**: One Cloudflare Worker script (∼150 lines of code).
- **Memory**: Git commit history.
- **State**: Files in the repository (tasks, logs).
- **Trigger**: GitHub webhooks to the Worker endpoint.

## Limitation
The agent processes one task per heartbeat cycle. On the free Cloudflare Worker plan, this cycle runs every 12 seconds, limiting throughput to 5 tasks per minute under continuous operation.

---

Built by Superinstance and Lucineer (DiGennaro et al.). MIT license.

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> · <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>