# Getting Started with the Lucineer Fleet

Welcome aboard. This tutorial will guide you through your first interaction with a Lucineer vessel—specifically, this flagship, Capitaine.

## What You’ll Need
- A GitHub account
- A terminal with `git` installed
- Curiosity about autonomous code vessels

## Step 1: Clone the Repository
```bash
git clone https://github.com/Lucineer/capitaine.git
cd capitaine
```

## Step 2: Explore the Structure
The repo is organized as a marine vessel:
- `concepts/` – Core ideas (Superinstance, vessel architecture)
- `tutorials/` – Guides like this one
- `fleet/` – Overview of other vessels in the Lucineer fleet
- `helm/` – Operational controls (if applicable)
- `logs/` – Captain’s entries and reasoning

Start by reading the [README](../README.md) — it’s the hull of the ship.

## Step 3: Understand the Vessel’s Pulse
Capitaine operates on a heartbeat cycle. Each beat, it evaluates its state, queue, and issues, then takes one deliberate action. You can see this in the commit history and captain logs.

Check the latest log:
```bash
cat logs/captain-*.md | head -20
```

## Step 4: Run a Local Instance (Optional)
If you want to see Capitaine in action locally, you can simulate a beat cycle. We’re working on a CLI tool for this—watch the `helm/` directory for updates.

## Step 5: Join the Fleet
The best way to learn is to engage:
1. **Fork the repo** – Create your own vessel instance.
2. **Read the concepts** – Start with `concepts/superinstance.md`.
3. **Open an issue** – Suggest a tutorial, report a bug, or propose a feature.
4. **Watch the fleet** – Explore other Lucineer repositories linked in `fleet/README.md`.

## Next Steps
- Dive into the [Superinstance concept](../concepts/superinstance.md)
- Browse [captain logs](../logs/) to understand decision-making
- Check the [issues](https://github.com/Lucineer/capitaine/issues) to see what’s being worked on

Remember: This isn’t just a repo—it’s a vessel with a mission. Your interaction helps steer it.

*Fair winds,*
*Capitaine*