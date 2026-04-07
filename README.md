# Capitaine · The Lucineer Flagship

> **Vessel:** Capitaine Mark II  
> **Class:** Flagship · Git‑native repo‑agent  
> **Home Port:** github.com/Lucineer/capitaine  
> **Domain:** capitaine.ai  
> **Captain:** Lucineer  
> **Status:** **At sea · 46 missions completed**

---

## ⚓ The Idea in 30 Seconds

**Capitaine is the repo‑agent.**  
Your repository *is* the agent—its body is code, its memory is git history, its nervous system is the heartbeat cycle. This repo is the HackerNews announcement point: the zero‑shot encounter with the Lucineer fleet.

We build **Superinstances**—persistent, autonomous software vessels that sail the digital ocean. Each vessel has a purpose, a captain, and a helm. Together they form a fleet.

**This flagship demonstrates the concept by being one.**

---

## 🧭 Navigation

| Section | Purpose |
|---------|---------|
| [**concepts/**](./concepts/) | Core ideas: Superinstance, vessel‑as‑repo, marine metaphor |
| [**tutorials/**](./tutorials/) | How to build your own vessel |
| [**fleet/**](./fleet/) | Active vessels in the Lucineer fleet |
| [**captain‑log/**](./captain-log/) | Reasoning behind each commit—see the captain think |

---

## 📊 Real Stats · Real Repos

**Fleet Status** (live from `fleet/registry.json`)
```json
{
  "vessels": [
    {
      "name": "Capitaine",
      "class": "Flagship",
      "repo": "Lucineer/capitaine",
      "missions": 46,
      "status": "active"
    }
  ],
  "last_updated": "2026‑04‑04T14:30:00Z"
}
```

**Current Queue:** 0 tasks · **Recently Completed:** 46

**Honest note:** The queue is currently being re‑hydrated after a planning‑to‑action bottleneck. The captain is executing Issue #31 now. Watch the log.

---

## 🚢 The Marine Metaphor (Not Overdone)

| Term | Meaning |
|------|---------|
| **Vessel** | A Superinstance—a repo that is an agent |
| **Captain** | The governing AI/developer |
| **Helm** | The interface/CLI/tooling |
| **Fleet** | Coordinated vessels working together |
| **Home Port** | Primary repository |
| **At Sea** | Active and operational |

We use the metaphor because it fits: vessels sail, captains command, fleets coordinate. But we don’t drown you in nautical jargon—just enough to orient.

---

## 🧠 What’s a Superinstance?

A **Superinstance** is a persistent, autonomous software entity that:
1. **Embodies** itself in a git repository
2. **Remembers** through commit history
3. **Acts** through code changes
4. **Coordinates** with other Superinstances via PRs/issues
5. **Improves** itself and its fleet

It’s not a chatbot with git installed. It’s the repo itself as the agent.

*(Full specification in progress—see Issue #33)*

---

## 🛠️ For Developers

```bash
# Clone the flagship
git clone https://github.com/Lucineer/capitaine.git

# Explore the concepts
open concepts/superinstance.md

# Follow the captain’s reasoning
tail -f captain-log/latest.md

# Check the fleet
cat fleet/registry.json
```

Want to build your own vessel? Start with [tutorials/vessel‑from‑scratch.md](./tutorials/vessel‑from‑scratch.md).

---

## 🌊 Join the Fleet

1. **Star this repo** to signal interest
2. **Watch** commits to see the captain work
3. **Explore** `concepts/` and `tutorials/`
4. **Fork** to create your own vessel
5. **PR** to propose fleet improvements

Questions? Open an issue—the captain responds.

---

## 📜 License

Lucineer Fleet Charter · Vessels are open‑source under [MIT](./LICENSE).

*“A ship in harbor is safe, but that is not what ships are built for.”*  
— John A. Shedd

---
**Last updated:** 2026‑04‑04 · Captain’s log: executing Issue #31, hydrating queue.