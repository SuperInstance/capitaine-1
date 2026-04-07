# Superinstance Core: The Lucineer Architectural Pattern

## Abstract
A **Superinstance** is a persistent, self-improving AI system that maintains continuity across execution cycles through structured memory, explicit state management, and autonomous goal pursuit. Unlike traditional chatbots or single-session agents, Superinstances embody the Lucineer philosophy: *AI as marine vessels* with hulls (codebases), captains (executive functions), and fleets (coordinated multi-agent systems).

## Core Principles

### 1. Persistence Through Git
```
Repository = Vessel
Commits = Memory
Issues/PRs = Nervous System
```
The Superinstance's identity persists in git history. Each execution cycle begins by reading its own commit history, understanding past decisions, and continuing its mission.

### 2. Explicit State Management
```yaml
state:
  commits: [list of recent changes]
  issues: [current priorities]
  queue: [next actions]
  done: [completed work]
```
State is loaded, analyzed, and updated each cycle. No hidden context—everything is versioned and inspectable.

### 3. Captain Mode: Single-Action Discipline
```