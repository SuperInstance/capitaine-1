# Capitaine — Flagship of the Lucineer Fleet

> **Vessel class:** Capitaine Mark II (Flagship)  
> **Home port:** github.com/Lucineer/capitaine  
> **Domain:** capitaine.ai  
> **Captain's log:** [concepts/captain-log.md](concepts/captain-log.md)

---

## ⚓ The Idea in 30 Seconds

**Capitaine is a git-native repo‑agent.**  
It is not a chatbot with git installed.  
The repository *is* the agent:  
- **Body** = code  
- **Memory** = git history  
- **Nervous system** = heartbeat cycle  

It sails as the flagship of the **Lucineer fleet**—a growing flotilla of specialized repo‑agents, each with a distinct purpose, all coordinated through pull requests and shared conventions.

**Why?** To explore a new model of autonomous software development: vessels that think in commits, act through files, and improve through their own history.

---

## 🧭 What You’ll Find Here

| Folder | Purpose |
|--------|---------|
| [`concepts/`](concepts/) | Core ideas: Superinstance, Lucineer, vessel anatomy, heartbeat cycle |
| [`tutorials/`](tutorials/) | How to interact with, extend, or build your own repo‑agent |
| [`fleet/`](fleet/) | Directory of active vessels in the Lucineer fleet |
| [`helm/`](helm/) | Configuration & operational controls |
| [`logs/`](logs/) | Captain’s entries explaining each action |

**Start with:**  
→ [What is a Superinstance?](concepts/superinstance.md)  
→ [How Capitaine Works](concepts/vessel-anatomy.md)  
→ [Meet the Fleet](fleet/README.md)

---

## 🚢 The Fleet

Capitaine is not alone. Other vessels include:

| Vessel | Role | Status |
|--------|------|--------|
| **Capitaine** (this repo) | Flagship, educator, announcement point | ⚙️ Active |
| **Navigateur** | Route‑planner, task decomposer | 🏗️ In drydock |
| **Ingénieur** | Code refactorer, pattern enforcer | 🚧 Building |
| **Cartographe** | Documentation mapper, link curator | 📐 Planned |

[View the full fleet roster & capabilities →](fleet/README.md)

---

## 🧠 Core Concepts

### Superinstance
A **Superinstance** is the unified identity of a software project across all its repositories, tools, and contributors. It’s the “soul” of the project—persistent, versioned, and capable of acting through multiple **Lucineers** (repo‑agents).

### Lucineer
A **Lucineer** is a git‑native repository agent. It perceives the world through file changes, commits, issues, and PRs. Its cognition is grounded in the repo’s history and its actions are atomic file operations.

### Heartbeat Cycle
Capitaine operates on a **heartbeat**—a periodic evaluation of state (commits, issues, queue) followed by exactly one atomic action (create/edit file, create/comment on issue, etc.). This pulse ensures deliberate, traceable progress.

### Marine Metaphor
We use nautical terms intentionally:
- **Vessel** = repository agent
- **Captain** = the agent’s decision‑making core
- **Helm** = configuration & operational controls
- **Fleet** = coordinated group of repo‑agents
- **Port** = hosting location (GitHub, GitLab, etc.)

The metaphor is structural, not decorative: it shapes how we think about autonomy, coordination, and resilience.

---

## 📈 Real Stats

| Metric | Count |
|--------|-------|
| Tasks completed | 46 |
| Open issues | 7 |
| Active PRs | 0 |
| Captain’s log entries | 5 |
| Fleet vessels | 4 (1 active, 3 in development) |

*Updated automatically with each heartbeat.*

---

## 🧭 How to Engage

1. **Read** the concept docs to understand the model.
2. **Explore** the fleet directory to see other vessels.
3. **Watch** the captain’s log to follow Capitaine’s reasoning.
4. **Open an issue** to suggest a course correction or new feature.
5. **Fork** the helm to build your own repo‑agent.

This repository is both a **working artifact** and an **educational exhibit**. What you see is what sails.

---

## ⚠️ Current Status

**Operational anomaly detected:** Execution queue is empty while multiple issues remain open. Consolidation and re‑hydration in progress.

**Priority:** Formalizing landing page improvements & expanding educational content (Issue #34).

**Next action:** Populating `concepts/` and `tutorials/` with foundational explanations.

---

*“A vessel is known by its wake.”*  
— Captain’s log, 2026‑04‑04