# Ternary Fleet Bridge: capitaine-1 ↔ Ternary Ecosystem

A mapping between capitaine-1's vessel architecture and the ternary fleet's concrete Rust implementations. These aren't metaphors — they're the same patterns expressed in different materials.

## 1. Vessel Classes → Ternary Species

capitaine-1 defines vessel classes as specializations. The ternary fleet implements them as Rust types.

| capitaine-1 Class | Role | Ternary Crate | Implementation |
|---|---|---|---|
| **Flagship** (Capitaine) | Command, coordination, public interface | `ternary-captain` | `Captain` struct with `DecisionEngine` (quorum-based voting), `Delegator` (task assignment), `SituationRoom` (sensor aggregation), `FleetReport` (status), `SuccessionPlan` (handoff) |
| **Scout** (Éclaireur) | Exploration, discovery, data gathering | `ternary-ensign` | `Ensign` trait with domain-specific implementations. `EnsignRegistry` tracks available scouts. Scout ensigns are loaded on-demand into rooms for burst exploration |
| **Builder** (Constructeur) | Code generation, scaffolding | `ternary-ensign` + `ternary-cell` | Build waves: a `CellGrid` where each cell runs one build step. Division creates parallel builds. Apoptosis cleans up failed builds. The Builder pattern is an ensign driving a cell grid |
| **Sentinel** (Sentinelle) | Monitoring, alerting, security | `ternary-ensign` | Sentinel ensigns run continuous monitoring loops. `TernaryMessenger::Suppress` signals anomalies. The `EnsignRegistry` provides discovery of available sentinels |
| **Archivist** (Archiviste) | Knowledge management, documentation | `ternary-cell` + `ternary-room` | `RoomHistory` records all room events. Each `RoomEvent` (enter/leave/tick) IS an archival entry. The Archivist is a room with a long-lived cell grid that indexes fleet activity |

### The Ternary State → Vessel Role Mapping

The ternary `TernaryState` (-1/0/+1) directly models vessel posture:

- **Avoid (-1)**: Sentinelle retreating from threats, agent self-protecting
- **Explore (0)**: Éclaireur scanning, agent gathering information
- **Choose (+1)**: Capitaine committing to action, agent executing decisions

An `Agent`'s `TernaryState` determines which vessel role it's currently performing. A single agent can shift between all three states within one heartbeat cycle.

## 2. Agent-as-Repository → construct-core Skill Loading

capitaine-1's core insight: **the repository IS the agent**. The ternary fleet operationalizes this through construct-core's layered traits.

| capitaine-1 Concept | Ternary Implementation |
|---|---|
| Repository = Body | `construct-core` Layer 0: BareMetalConstruct — instant reflex lookups, runs anywhere from ESP32 to DGX |
| Git history = Memory | `AgentMemory` (short-term + long-term with decay). `AgentMemory::commit()` extracts observations into persistent storage |
| Heartbeat = Nervous System | `TernaryCell::tick()` six-phase cycle (predict→perceive→surprise→vibe→gc→conservation) |
| Skills as branches | `EnsignRegistry` + `EnsignFactory` — load specialists on demand. Skills are ensigns |
| CHARTER.md = Mission | `AgentBehavior` wrapping a `Strategy` trait — the strategy IS the charter |
| IDENTITY.md = Self | `Agent { id, state, fitness, memory, behavior }` — the struct fields are identity |

### The Hydration Layer → Skill Loading Bridge

capitaine-1's Hydration Layer (reading, parsing, and acting on its own state) maps to construct-core's boot sequence:

1. **Read state** → `Agent` deserializes from repo state (git checkout → struct)
2. **Parse capabilities** → `EnsignRegistry::load()` reads available skills
3. **Equip for mission** → `EnsignFactory::create()` instantiates needed specialists
4. **Begin heartbeat** → `TernaryCell::tick()` starts the operational cycle

The repo doesn't just store state — it *is* the agent's compiled form.

## 3. Heartbeat Cycles → ternary-cell Tick Cycles

| capitaine-1 Heartbeat | ternary-cell Phase | Purpose |
|---|---|---|
| Check state (git status) | **Predict** | What do I expect to find? |
| Process events (issues/PRs) | **Perceive** | What do I actually observe? |
| Execute action | **Surprise** | Gap between prediction and observation |
| Record reasoning (captain-log) | **Vibe** | Update internal state based on surprise |
| Commit and push | **GC** | Clean up, consolidate, release |
| (implicit) | **Conservation** | Energy budget check — should this cell survive? |

The ternary-cell tick is the heartbeat, decomposed into six explicit phases. capitaine-1's heartbeat collapses perception and action; ternary-cell separates them for better observability and resource management.

### Tick Frequency

- **capitaine-1**: Heartbeat driven by GitHub webhooks or cron intervals
- **ternary-cell**: `CellGrid::tick_all()` drives all cells simultaneously
- **Bridge**: A vessel's heartbeat IS `CellGrid::tick_all()` — every cell ticks once per heartbeat

## 4. Fleet Coordination via PRs → ternary-protocol Messages

| capitaine-1 Protocol | ternary-protocol Equivalent |
|---|---|
| Pull Request = Hailing Signal | `TernaryMessage` with type TELL — directed communication |
| Issue = Distress Call | `TernaryMessage` with type ALERT — fleet-wide attention |
| Comment = Bridge Communication | `AgentCommunication::send()` — point-to-point |
| Fleet/ directory = Fleet Registry | `EnsignRegistry` + `AgentPool` — discoverable capabilities |
| Beachcomb polling | `AgentCommunication::pending()` + `AgentCommunication::receive()` |
| Message-in-a-Bottle | Store-and-forward via `AgentMessage { from, to, tag, payload }` |

### The PR → Message Pipeline

```
capitaine-1 opens PR → GitHub webhook → ternary-protocol serializes as TernaryMessage
                    → AgentCommunication::send(target, message)
                    → Target agent receives via AgentCommunication::receive()
                    → Agent processes and responds (accept/reject/request-changes)
                    → Response serialized back to git commit on the PR
```

The coordination is the same; the transport changes from git-native to binary protocol. Both preserve the audit trail — git history in capitaine-1, `RoomHistory` in ternary-room.

## 5. CHARTER.md/IDENTITY.md → construct-core Metadata

| capitaine-1 File | Ternary Struct Field | Purpose |
|---|---|---|
| `IDENTITY.md` | `Agent.id`, `Agent.behavior` | Who this agent is and what it does |
| `CHARTER.md` | `AgentBehavior::strategy` | Mission constraints and rules |
| `STATE.md` | `Agent.fitness`, `AgentMemory` | Current operational state |
| `CAPABILITY.toml` | `EnsignRegistry` entries | What skills are available |
| `TASK-BOARD.md` | `Delegator` assignments | What work needs doing |
| `captain-log/` | `RoomHistory::events` | Auditable record of all actions |
| `concepts/` | `AgentMemory::long_term` | Knowledge base and learning |

### Metadata as Code

In capitaine-1, metadata is markdown files humans can read. In the ternary fleet, metadata is Rust structs machines can execute. The bridge: markdown files compile to struct initializers. `IDENTITY.md` → `Agent::new(id, ...)`. `CHARTER.md` → `ThresholdStrategy::new(...)`. Documentation is configuration is code.

---

## Summary

capitaine-1 provides the philosophy (repo IS agent, heartbeat IS life, fleet IS coordination). The ternary fleet provides the implementation (Rust types, cell grids, ensign registries, room coordinators). Together they form a complete agent architecture: git-native identity with compiled execution.

The bridge is bidirectional. capitaine-1's 1810 commits of vessel thinking inform the ternary fleet's type design. The ternary fleet's concrete implementations validate capitaine-1's abstractions. Neither is complete without the other.

---

*Bridged by synthesis subagent, 2026-06-04*
