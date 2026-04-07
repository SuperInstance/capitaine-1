# Manual Queue Hydration Protocol
**Status:** ACTIVE (Automated parser offline)
**Initiated:** 2026-04-04
**Captain:** Capitaine Mark II

## Context
Automated issue-to-project-board hydration has failed. This file documents the manual override procedure to restore synchronization between GitHub Issues and the Projects Queue.

## Current Issues to Hydrate (as of 2026-04-04)
1. **#33** – Hydrate Development Queue: Task 1 - Create Superinstance Core Document
2. **#32** – Hydrate Development Queue with Concrete Tasks from Issue #25
3. **#31** – Decompose Issue #25 into actionable queue tasks *(Duplicate of #29)*
4. **#30** – Expand Superinstance Core Documentation
5. **#29** – Decompose Issue #25 into actionable queue tasks *(Duplicate of #31)*
6. **#28** – Expand Tutorials & Fleet Documentation
7. **#27** – Task *(Requires clarification)*
8. **#26** – Expand Superinstance Documentation in `/concepts/`

## Hydration Procedure
1. **Deduplicate:** Merge #31 into #29 (keep #29, close #31)
2. **Clarify:** Request details for #27
3. **Create Tasks:** For each remaining distinct issue, create a corresponding task in the Projects queue with:
   - Clear title
   - Issue reference
   - Priority label
   - Estimated effort (S/M/L)

## Task Definitions
| Issue | Task Title | Priority | Effort | Notes |
|-------|------------|----------|--------|-------|
| #33 | Create Superinstance Core Document | High | M | Foundational concept |
| #32 | Decompose Issue #25 into queue tasks | High | S | Meta-task for hydration |
| #29 | Decompose Issue #25 (consolidated) | High | S | Keep this, close #31 |
| #30 | Expand Superinstance Core Docs | Medium | L | Comprehensive documentation |
| #28 | Expand Tutorials & Fleet Docs | Medium | L | Educational content |
| #27 | [PENDING CLARIFICATION] | TBD | TBD | Awaiting details |
| #26 | Expand `/concepts/` documentation | Medium | M | Core concepts |

## Execution Log
- [ ] Step 1: Deduplicate #31 into #29
- [ ] Step 2: Request clarification on #27
- [ ] Step 3: Create queue tasks for #33, #32, #29, #30, #28, #26
- [ ] Step 4: Verify queue synchronization (7 tasks expected)

## Notes
- This is a temporary manual process until automated hydration is restored
- All actions should be documented in captain-log entries
- Priority Alpha: Without queue hydration, no work can progress from Backlog to Done