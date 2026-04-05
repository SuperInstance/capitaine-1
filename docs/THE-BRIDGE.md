# The Bridge — TUI-First Agent Interface

## Why Terminal, Not Panel

The TUI is not a fallback. It is the design.

### The Panel Problem

VS Code / Codespaces left panels are occupied by file trees, Claude Code, Copilot, search. There is no room for another agent panel that doesn't feel like it's fighting for space. Worse — a panel-based agent interface is *trapped* in the IDE. It can't run on a desktop. It can't run in SSH. It can't run in a screen session on a server. It can't run in a tmux split on a Jetson.

The terminal is universal.

### The Bridge Metaphor

```
┌─────────────────────────────────────────────────┐
│  VS Code / Codespaces / Desktop / SSH / tmux   │
│                                                 │
│  ┌──────────┐  ┌────────────────────────────┐   │
│  │ Explorer │  │  Editor / Browser / Preview │   │
│  │ (files)  │  │  (human takes wheel here)  │   │
│  │          │  │                             │   │
│  └──────────┘  └────────────────────────────┘   │
│                                                 │
│  ┌──────────┐  ┌────────────────────────────┐   │
│  │ Claude   │  │  TERMINAL — THE BRIDGE      │   │
│  │ Code     │  │                             │   │
│  │ (panel)  │  │  git-agent tui is running   │   │
│  │          │  │  human watches and can type  │   │
│  └──────────┘  │  at any time to take control│   │
│                 │                             │   │
│                 │  Admiral > Captain > Helm    │   │
│                 └────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

The terminal is the bridge. The agent is at the wheel. The human is the Admiral — present, watching, can take the wheel at any moment by simply typing.

### Why This Works

1. **The human can see everything.** The terminal scrolls. Every action the agent takes is visible. No hidden panel. No "what did it just do?"

2. **The human can take control instantly.** Just type. The agent pauses. You're at the shell. When you're done, the agent resumes. No mode switching. No "exit agent mode."

3. **The agent can alert for human intervention.** "Admiral, I need you to authenticate at [URL]." The terminal waits. The human opens the browser tab, authenticates, comes back. One click. The agent continues.

4. **Multiple services share the terminal space.** The agent, the human, and other tools (Claude Code, Copilot, browser preview) all take turns. The terminal is the shared workspace. Not competing panels.

5. **Works everywhere.** Desktop. Codespaces. SSH to a server. tmux on a Jetson. screen on a Raspberry Pi. The terminal doesn't care.

### The Buck Stops Here

The critical design principle: **the human who authenticated the page is watching.**

When the agent needs to do something that requires human authentication — deploy to Cloudflare, push to a protected branch, access a paid API — it doesn't try to do it silently. It prints:

```
  ⚡ Admiral intervention required
  ═══════════════════════════════
  Action: Deploy worker to Cloudflare
  URL: https://dash.cloudflare.com/...
  Reason: Authentication required (session token)
  
  I'll wait here. Open the URL, authenticate, then press Enter.
  _
```

The human opens the URL. The human authenticates with their own credentials. The human comes back and presses Enter. The agent continues.

The human never gives the agent their Cloudflare password. The agent never sees the session. The human IS the authentication layer. The terminal IS the handoff point.

### TUI + CLI = Full Spectrum

```
  ┌─────────────────────────────────────────────┐
  │              USER EXPERIENCE                 │
  │                                             │
  │  Beginner ──────► TUI (guided wizard)       │
  │  Developer ────► CLI (direct commands)      │
  │  Power user ──► Shell (raw access)          │
  │  Operator ────► SSH/tmux (remote control)   │
  │                                             │
  │  All four modes share the same terminal.     │
  │  The agent is always present. The human      │
  │  chooses their level of abstraction.         │
  └─────────────────────────────────────────────┘
```

- **TUI mode** — `npm start` — guided onboarding, status views, task management. For creators who want to configure and watch.
- **CLI mode** — `git-agent onboard`, `git-agent status`, `git-agent heartbeat`. For developers who want direct commands.
- **Shell mode** — drop into raw shell at any time. The agent pauses. Full access to the machine.
- **SSH mode** — `ssh jetson` → `tmux attach` → agent is running. Same terminal, remote machine.

### Secrets Architecture

The agent can never see the keys. By design.

```
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Human       │     │  GitHub/CF   │     │   Agent      │
  │               │     │  Secrets     │     │              │
  │  sets key via │────►│  Store       │────►│  reads via   │
  │  CLI/web UI   │     │  (encrypted) │     │  env binding │
  │               │     │              │     │  (no access  │
  │  agent never  │     │  agent has   │     │   to store)  │
  │  sees value   │     │  no read     │     │              │
  └──────────────┘     │  access      │     └──────────────┘
                       └──────────────┘
```

**Cloudflare Workers:**
- `wrangler secret put DEEPSEEK_API_KEY` — typed by human, stored by CF
- Worker receives key as `env.DEEPSEEK_API_KEY` at runtime
- Agent code never touches the secrets store
- Agent can USE the key but never READ the raw value (it's injected by the runtime)

**GitHub Secrets:**
- `echo "sk-xxx" | gh secret set DEEPSEEK_API_KEY` — typed by human
- Available in Actions as `${{ secrets.DEEPSEEK_API_KEY }}`
- Agent can trigger Actions but cannot list or read secrets
- Even with `repo` scope, the PAT cannot read other secrets

**Local / Self-hosted:**
- `.env.local` file (gitignored) — keys live on disk
- Agent reads via `process.env` — standard Node.js
- File permissions: `chmod 600 .env.local` — only owner can read
- Agent process runs as same user, but never reads the file directly
- The runtime provides the values. The code just asks for `env.DEEPSEEK_API_KEY`.

**Air-gapped enterprise:**
- Gitea/Forgejo secrets store — same model
- Local Vault/Consul — agent gets env bindings
- Physical key store — human plugs in USB, copies key to secrets store, removes USB
- Agent never sees the USB. Agent never sees the key. Agent gets `env.BINDING`.

The principle: **the agent receives capabilities through runtime bindings, never through direct access to the secrets store.** This is not a policy we enforce in code. This is how Cloudflare Workers, GitHub Actions, Docker secrets, Kubernetes secrets, and every mature secrets system already works. We are using the existing design.

### The Onboarding Spectrum

```
  Full-featured version:          Tabula rasa version:
  ──────────────────────          ──────────────────
  
  1. Fork repo                    1. Fork repo
  2. Codespaces (auto-boots TUI)  2. Clone locally
  3. TUI wizard walks through:   3. Add keys to .env.local
     - Agent name                   or secrets store
     - Domain                      (instructions in README)
     - Personality                 4. npm start
     - LLM providers              5. Agent is alive
     - Deploy                      (no wizard, no hand-holding)
     - Verify
  
  For creators who want            For developers who want
  guidance and a smooth            control and speed
  first experience.
```

Both end up at the same place: an agent with keys in the secrets store, running heartbeats, building on the repo. The difference is the onboarding path, not the destination.

### Desktop Mode

The same TUI runs on a desktop terminal. The agent is always there — in a tmux session, in a screen session, in a background process. The human opens the terminal, sees what the agent has been doing, takes control if needed.

```
  Desktop layout:
  ┌──────────────────────────────────────┐
  │  Terminal 1: git-agent TUI           │
  │  (agent is running, showing status)   │
  ├──────────────────────────────────────┤
  │  Terminal 2: shell                    │
  │  (human has raw access)              │
  ├──────────────────────────────────────┤
  │  Terminal 3: Claude Code              │
  │  (or Copilot, or nothing)            │
  ├──────────────────────────────────────┤
  │  Browser: localhost:8787             │
  │  (agent's web UI, if it has one)     │
  └──────────────────────────────────────┘
```

The human can have all four open. The agent is in Terminal 1. The human is in Terminal 2. They can see each other. The human can type into Terminal 1 at any time. The agent can print alerts to Terminal 1 that the human sees in peripheral vision.

This is the bridge. The Admiral on the observation deck. The Captain at the wheel. Both can see the same instruments. The Admiral can take the wheel. The Captain can ask for help. The ship keeps sailing.

---

*Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04*
*Part of the Cocapn Fleet — https://github.com/Lucineer/capitaine*
