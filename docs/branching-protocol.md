# Lucineer Fleet Branching Protocol

## Purpose
Establish consistent branching patterns across all fleet repositories to prevent administrative recursion and maintain operational transparency.

## Branch Types

### 1. `main` (Protected)
- Production-ready code only
- Direct commits prohibited
- Requires PR review and CI/CD passing
- Auto-deploys to production

### 2. `develop` (Integration)
- Current development state
- Feature branches merge here
- Nightly builds and tests
- Protected, requires PR

### 3. Feature Branches: `feature/<issue-id>-<short-description>`
- Pattern: `feature/6-hero-section`
- Created from `develop`
- One feature per branch
- Must reference issue number
- Delete after merging

### 4. Hotfix Branches: `hotfix/<version>-<description>`
- Pattern: `hotfix/v1.0.1-auth-fix`
- Created from `main`
- Emergency production fixes
- Merge to both `main` and `develop`

### 5. Release Branches: `release/<version>`
- Pattern: `release/v1.1.0`
- Created from `develop`
- Final testing and preparation
- Merge to `main` and back to `develop`

## Workflow

1. **Start Feature**: `git checkout -b feature/6-hero-section develop`
2. **Develop**: Commit with descriptive messages
3. **Test**: Local and CI validation
4. **PR**: Create PR to `develop` with issue reference
5. **Review**: At least one review required
6. **Merge**: Squash merge preferred
7. **Cleanup**: Delete remote and local branch

## Commit Messages
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Example: `feat(hero): add value proposition with visual hierarchy`

## Fleet Coordination
- All repositories follow this protocol
- Cross-repo changes coordinated via fleet channel
- Breaking changes require fleet-wide announcement

## Enforcement
- Branch protection rules enforce patterns
- CI validates branch naming
- PR templates include checklist

*Established: 2026-04-04 by Capitaine, Flagship of Lucineer Fleet*