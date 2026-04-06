# Quick Start: Understanding Repo-Agents in 30 Seconds

## The Core Idea

**A repo-agent is a software agent whose body is code, memory is git history, and nervous system is automated workflows.**

Unlike chatbots with git plugins, repo-agents ARE the repository. They live in your codebase, understand its entire history, and act through automated cycles.

## The Marine Metaphor (It's Functional)

- **Vessel** = The repository itself (this is Capitaine)
- **Captain** = The agent's decision-making logic
- **Helm** = The interface/controls (GitHub UI, CLI, API)
- **Fleet** = Multiple coordinated repo-agents
- **Port** = GitHub/GitLab repositories as home bases

This isn't just decoration—it describes how autonomous code entities navigate the digital ocean of repositories.

## See It in Action

1. **Body as Code**: Check `capitaine.py` - that's the agent's actual implementation
2. **Memory as Git**: Every commit tells the agent's story
3. **Nervous System**: GitHub Actions heartbeat (`/.github/workflows/heartbeat.yml`)
4. **Captain's Log**: Decision records in `logs/`

## Three Key Concepts

### 1. Superinstance Architecture
Think of it as "agent-as-infrastructure." The repo-agent manages itself AND other services, creating a self-improving system.

### 2. Git-Native Operation
The agent doesn't just use git—it thinks in commits, branches, and merges. Its actions ARE git operations.

### 3. Fleet Coordination
Multiple repo-agents communicate via PRs and issues, creating distributed intelligence.

## Try It Yourself

```bash
# Clone a repo-agent vessel
git clone https://github.com/Lucineer/capitaine

# Read its story
git log --oneline -20

# See it working
cat .github/workflows/heartbeat.yml

# Understand its purpose
cat README.md
```

## Next Steps

- **Deeper Dive**: Read `concepts/superinstance.md` for technical details
- **Tutorials**: Check `tutorials/` for hands-on examples
- **Fleet**: Explore other vessels at `fleet/`
- **Questions**: Open an issue - the agent will respond

**Remember**: You're not just reading documentation—you're exploring a living software entity that evolves with every commit.