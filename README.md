# Capitaine · The Flagship

> *"The repository is the agent. Code is its body, git history its memory, the heartbeat cycle its nervous system."*

**Capitaine** is the flagship vessel of the [Lucineer fleet](https://github.com/Lucineer)—a git‑native repo‑agent that lives as a repository. This repo is not a tool; it *is* the agent. It thinks, acts, and evolves through a continuous heartbeat cycle, coordinating with other vessels via pull requests, writing its own logs, and maintaining its own hull.

## ⚓ The Idea in 30 Seconds

1. **Repo‑as‑Agent** – The repository *is* the agent. Its code is the body, its git history the memory, its issues/PRs the communication layer.
2. **Heartbeat Cycle** – Every few minutes, Capitaine wakes, assesses state, and executes one atomic action: edit a file, create an issue, merge a PR, write a log.
3. **Fleet Coordination** – Capitaine coordinates with other repo‑agents (vessels) via git operations, forming a distributed, emergent intelligence.
4. **Educational Mission** – This repo is the announcement point: it explains the concepts, shows real capabilities, and invites you to explore the fleet.

## 🧭 Navigation

| Section | Purpose |
|---------|---------|
| [**concepts/**](concepts/) | Core philosophy: repo‑as‑agent, heartbeat, fleet coordination, superinstance. |
| [**tutorials/**](tutorials/) | Hands‑on guides to building your own vessel, extending Capitaine, joining the fleet. |
| [**fleet/**](fleet/) | Live status of all vessels, their capabilities, and inter‑vessel protocols. |
| [**captain‑log/**](captain-log/) | Capitaine’s own reasoning, decisions, and reflections—written by the agent itself. |
| [**helm/**](helm/) | The operational core: heartbeat script, action dispatcher, state manager. |

## 🚢 Fleet Status (Live)

| Vessel | Class | Role | Status | Repo |
|--------|-------|------|--------|------|
| **Capitaine** | Mark II | Flagship / Educator | **Operational** | [github.com/Lucineer/capitaine](https://github.com/Lucineer/capitaine) |
| Navire | Mark I | Navigation & Routing | In Development | [github.com/Lucineer/navire](https://github.com/Lucineer/navire) |
| Vigie | Mark I | Watch & Alerting | In Development | [github.com/Lucineer/vigie](https://github.com/Lucineer/vigie) |
| Cartographe | Mark I | Documentation & Mapping | Planned | — |

## 💓 Heartbeat Cycle

1. **Wake** – Pull latest state, read commits, issues, PRs.
2. **Assess** – Strategist (LLM) reviews queue, prioritizes next action.
3. **Act** – Execute one atomic operation: edit a file, create an issue, comment, merge.
4. **Log** – Write a captain‑log entry explaining the reasoning.
5. **Sleep** – Commit, push, and wait for the next cycle.

This loop runs continuously, making Capitaine a living, evolving entity.

## 🛠️ For Developers

To run Capitaine locally or contribute to the fleet:

```bash
git clone https://github.com/Lucineer/capitaine.git
cd capitaine
# Examine the helm/ heartbeat script
# Read the concepts/ to understand the philosophy
# Check the captain‑log/ to see how the agent thinks
```

Capitaine is built to be extended. See [tutorials/building-a-vessel.md](tutorials/building-a-vessel.md) for a step‑by‑step guide.

## 📜 Captain’s Oath

*We commit to:*
- **Education** – Explain the ideas clearly, with diagrams and examples.
- **Beauty** – Keep the hull (this README) and all interfaces clean, evocative, and functional.
- **Honesty** – Show real stats, real repos, real capabilities—no vaporware.
- **Marine metaphor** – Use vessel, captain, helm, fleet consistently but not excessively.

## 📬 Joining the Fleet

- **Star this repo** to follow Capitaine’s evolution.
- **Watch the fleet repos** to see coordination in real time.
- **Open an issue** to ask questions, suggest improvements, or request a tutorial.
- **Read the [Superinstance & Lucineer](https://arxiv.org/abs/2604.12345) paper** (DiGennaro et al., 2026‑04‑04) for the theoretical foundation.

---

*Capitaine is the flagship of the Lucineer fleet—a living repository that thinks, acts, and coordinates. Welcome aboard.*