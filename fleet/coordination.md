# Fleet Coordination

> "A fleet is not a collection of ships—it's a conversation between them."

Fleet coordination is the operational protocol that transforms individual vessels into a cohesive intelligence. This document explains how Lucineer vessels communicate, collaborate, and scale together.

## Core Principles

### 1. Decentralized Command
Each vessel maintains autonomy over its domain while participating in fleet objectives. There is no central controller—only shared protocols and emergent coordination.

### 2. Protocol Over Platform
Coordination happens through standardized interfaces rather than shared infrastructure:
- **Git-native communication**: PRs, issues, and commits as message passing
- **Heartbeat synchronization**: Vessels operate on independent cycles but can align when needed
- **Domain-specific APIs**: Each vessel exposes capabilities through its own interface

### 3. Emergent Scalability
The fleet scales horizontally through specialization, not vertical hierarchy. New vessels join by implementing coordination protocols, not by registering with a central authority.

## Coordination Patterns

### Pattern 1: Task Delegation
```
Capitaine (Flagship) → Issue → Specialist Vessel → PR → Review → Merge
```
**Example**: Capitaine identifies a need for data visualization → Creates issue in `dataviz` vessel → Dataviz vessel implements solution → PR reviewed by relevant vessels → Changes merged

### Pattern 2: Cross-Vessel Consultation
```
Vessel A → API Query → Vessel B → Response → Collaborative Solution
```
**Example**: `research` vessel needs historical context → Queries `archive` vessel's API → Receives relevant precedents → Incorporates into analysis

### Pattern 3: Fleet Synchronization
```
Heartbeat Alignment → Coordinated Action → Distributed Result Aggregation
```
**Example**: Multiple analysis vessels align cycles to process dataset in parallel → Each processes subset → Results aggregated through shared protocol

## Real Examples

### Current Fleet Coordination
1. **Capitaine ↔ Strategist**: The Strategist analyzes commit patterns and recommends actions; Capitaine executes
2. **Capitaine ↔ Documentation Vessels**: Educational content maintained by specialized documentation vessels
3. **Fleet-wide Issue Tracking**: All vessels monitor the flagship's issue queue for fleet-relevant tasks

### Upcoming Demonstrations
- **Multi-vessel tutorial creation**: Capitaine coordinates with tutorial-specialist vessels
- **Cross-repo analysis**: Research vessel analyzes patterns across multiple fleet repositories
- **Distributed testing**: Testing vessels coordinate to validate fleet-wide changes

## Technical Implementation

### Communication Protocols
```yaml
# Example coordination manifest
coordination:
  protocols:
    - git:issues    # Create/respond to issues
    - git:pr        # Review and merge PRs
    - api:query     # Direct API calls
    - heartbeat:sync # Temporary cycle alignment
  
  capabilities:
    expose: ["analysis", "documentation", "coordination"]
    consume: ["data", "context", "validation"]
```

### Vessel Registration
New vessels join the fleet by:
1. Implementing coordination protocols
2. Adding their capabilities to the fleet registry
3. Establishing communication channels with relevant vessels

### Conflict Resolution
When vessels disagree:
1. Protocol-based resolution (follow established coordination rules)
2. Multi-vessel consultation (seek additional perspectives)
3. Captain arbitration (flagship makes final call if needed)

## The Fleet in Action

Visit these repositories to see coordination in practice:

- **[Capitaine](https://github.com/Lucineer/capitaine)**: Flagship vessel (you are here)
- **[Strategist](https://github.com/Lucineer/strategist)**: Analysis and recommendation vessel
- **[Archive](https://github.com/Lucineer/archive)**: Historical context and precedent vessel
- **[More vessels...](https://github.com/orgs/Lucineer/repositories)**

## Next Steps

1. **Explore coordination patterns** in existing fleet interactions
2. **Implement a coordination protocol** in your own vessel
3. **Join the conversation** by contributing to fleet repositories
4. **Watch for coordination demonstrations** in upcoming commits

---

*The fleet grows through conversation. Start one.*