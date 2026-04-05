# Branching Protocols for Lucineer Fleet

## Overview
This document establishes standardized branching protocols for all Lucineer fleet repositories to prevent administrative recursion and ensure efficient workflow.

## Branch Types

### 1. Main Branch (`main`)
- **Purpose**: Production-ready code only
- **Protection**: Requires PR review, status checks
- **Deployment**: Auto-deploys to production
- **Naming**: Always `main`

### 2. Development Branch (`develop`)
- **Purpose**: Integration branch for features
- **Protection**: Requires PR review
- **Naming**: Always `develop`
- **Flow**: Features → develop → main

### 3. Feature Branches
- **Purpose**: Single feature or fix implementation
- **Naming**: `feature/[issue-number]-[short-description]` (e.g., `feature/9-branching-protocols`)
- **Source**: Always branch from `develop`
- **Destination**: Always merge to `develop` via PR
- **Lifetime**: Delete after merge

### 4. Hotfix Branches
- **Purpose**: Critical production fixes
- **Naming**: `hotfix/[issue-number]-[short-description]`
- **Source**: Branch from `main`
- **Destination**: Merge to both `main` and `develop`
- **Lifetime**: Delete after merge

### 5. Release Branches
- **Purpose**: Release preparation
- **Naming**: `release/[version]` (e.g., `release/v1.2.0`)
- **Source**: Branch from `develop`
- **Destination**: Merge to `main` and `develop`
- **Lifetime**: Delete after release

## Workflow Rules

### Creation Protocol
1. **Issue First**: Always create an issue before branching
2. **Branch from Correct Source**: 
   - Features: `develop`
   - Hotfixes: `main`
   - Releases: `develop`
3. **Descriptive Names**: Include issue number and brief description

### PR Protocol
1. **One PR per Branch**: Each branch must have exactly one PR
2. **Linked Issues**: PR must reference issue number
3. **Review Required**: At least one approved review
4. **Status Checks**: All checks must pass
5. **Squash Merge**: Use squash merge for clean history

### Cleanup Protocol
1. **Delete After Merge**: Branches deleted after successful merge
2. **Stale Branch Policy**: Branches inactive for 14 days will be automatically deleted
3. **Branch Protection**: `main` and `develop` branches protected

## Fleet Coordination

### Cross-Repository Dependencies
When changes affect multiple fleet repositories:
1. Create issue in each affected repo
2. Branch in primary repo first
3. Coordinate PRs with linked references
4. Update fleet documentation if protocols change

### Captain's Log Entries
Each significant branch operation should include:
- Reason for branching
- Linked issues
- Expected outcomes
- Any fleet-wide implications

## Enforcement

### Automated Checks
- Branch name validation
- PR template requirements
- Required status checks
- Stale branch detection

### Manual Oversight
- Captain reviews protocol adherence
- Strategist analyzes workflow efficiency
- Fleet-wide protocol consistency checks

## Revision History
- 2026-04-04: Initial protocol establishment (Issue #9)

---
*Protocols established to prevent administrative recursion and ensure efficient fleet coordination.*