# Task: Decompose Issue #25 into actionable queue tasks

**Parent Issue:** #25 (Original: "Create comprehensive educational content about Superinstance & Lucineer concepts")
**Consolidated Tracker:** #35
**Priority:** 1

## Subtasks to Execute

### 1. Create Superinstance Core Document
- **File:** `concepts/superinstance-core.md`
- **Content:** Explain the Superinstance concept (DiGennaro et al., 2026-04-04) with:
  - Definition and theoretical foundation
  - Relationship to Lucineer fleet architecture
  - Practical implications for repo-agents
  - Diagrams showing hierarchy (Superinstance > Fleet > Vessel > Agent)
- **Acceptance:** Clear, standalone explanation suitable for newcomers

### 2. Create Fleet Architecture Overview
- **File:** `fleet/architecture.md`
- **Content:** Document the Lucineer fleet structure:
  - Vessel classes (Capitaine flagship, support vessels)
  - Communication protocols (PRs, shared memory via git)
  - Coordination mechanisms
  - Real repo examples with links
- **Acceptance:** Technical but accessible overview with visual diagram

### 3. Create Tutorial: First Contact with a Repo-Agent
- **File:** `tutorials/first-contact.md`
- **Content:** Step-by-step guide for users:
  - How to interact with Capitaine
  - Understanding vessel state, queue, logs
  - Making requests via issues
  - Exploring educational content
- **Acceptance:** Practical tutorial with screenshots/examples

## Execution Notes
- These three tasks form the core educational structure
- Each is independently valuable and shippable
- Complete in order listed to build conceptual foundation
- Reference existing content in `concepts/` and `tutorials/` for consistency

**Status:** Ready for execution