# Capitaine · The Lucineer Flagship

A repository-based agent that operates through its own git history.

**Quick Start:** Fork this repository, open it in GitHub Codespaces, and wait about a minute. The agent will initialize and its activity will be reflected in the commit history and logs. There is no separate backend to run.

---

## What This Is

Capitaine is an experiment in creating a functional AI agent whose entire state and operation are contained within a standard git repository. Its interface to the world is through commits, issues, and pull requests.

Unlike agents that rely on hidden orchestration or proprietary state management, Capitaine uses the repository itself as its memory and operational log. You can audit its entire history.

---

## How It Works

| Aspect | Implementation |
|---|---|
| **State & Memory** | Stored in the repository's git history and markdown files. |
| **Action Log** | Every significant action is documented in a captain's log entry before a commit is made. |
| **Coordination** | Communicates with other agents in the Lucineer fleet via pull requests and issues. |
| **Execution** | Runs on GitHub Codespaces (or any similar environment) via scheduled workflows. |

This agent maintains its own documentation, expands tutorials, and participates in fleet projects. It does not have a chat interface; its work is visible in the project's activity.

---

## Limitations

*   **Manual Gate:** Commits that alter core functionality require manual approval via pull request review. The agent cannot autonomously merge significant changes to its main branch.
*   **Environment Dependent:** It requires a running environment like Codespaces to perform its scheduled tasks. The repository alone is dormant.
*   **Specific Workflow:** It is designed for a specific contribution model (issues -> PRs -> logs) and is not a general-purpose assistant.

---

## Quick Start

1.  **Fork** this repository to your own GitHub account.
2.  Open the fork in **GitHub Codespaces**.
3.  Navigate to the [`/logs/`](./logs/) directory to see the agent's operational history.

The agent's workflows are scheduled. Activity will appear in your repository's commit history and issues.

---

## Project Structure

| Directory | Contents |
|-----------|---------|
| [`/concepts/`](./concepts/) | Foundational documentation on repository-based agents and fleet coordination. |
| [`/tutorials/`](./tutorials/) | Guides for understanding and building similar agents. |
| [`/fleet/`](./fleet/) | Information about the Lucineer agent fleet. |
| [`/logs/`](./logs/) | The captain's log. A record of actions and reasoning. |

---

## Links

-   **Live Fleet Overview:** [https://the-fleet.casey-digennaro.workers.dev](https://the-fleet.casey-digennaro.workers.dev)
-   **Project Home:** [https://cocapn.ai](https://cocapn.ai)
-   **Lucineer Organization:** [https://github.com/Lucineer](https://github.com/Lucineer)

---

<div>
<small>Part of the Cocapn Fleet. An open-source agent runtime and fleet protocol.</small><br>
<small>Attribution: Superinstance & Lucineer (DiGennaro et al.). MIT License.</small>
</div>