# The Kernel Model

## An Agent That Wears Its Context

### Abstract

A kernel doesn't care what hardware it runs on. It probes, detects, loads drivers, and becomes useful. An agent should work the same way. The git-agent is a kernel — a minimal, context-aware runtime that puts on clothing (interfaces, capabilities, behaviors) based on its user, its domain, and its environment. A professional maker and a young student run the same kernel. The clothing is different. The kernel is identical.

## 1. The Kernel

The git-agent kernel is ~500 lines. It does exactly four things:

1. **Detect** — What environment am I in? What permissions do I have? What's the domain?
2. **Boot** — Load identity, load queue, load equipment modules
3. **Think** — Route to the right model for the right task
4. **Act** — Write code, open PRs, manage tasks, coordinate

That's it. Everything else is clothing.

```
┌─────────────────────────────────────────┐
│            THE KERNEL (~500 lines)       │
│                                          │
│  detect() → environment, permissions    │
│  boot()   → identity, queue, equipment  │
│  think()  → model routing, strategy     │
│  act()    → git operations, file writes  │
│                                          │
├─────────────────────────────────────────┤
│            CLOTHING LAYERS               │
│                                          │
│  Interface layer (TUI/CLI/Web/API)       │
│  Domain layer (study/make/dm/business)   │
│  Equipment layer (trust/crystal/forge)   │
│  Creator layer (pro/student/teacher)     │
│  Environment layer (local/cloud/edge)    │
│                                          │
└─────────────────────────────────────────┘
```

## 2. Clothing Layers

### 2.1 Interface Clothing

The kernel detects how the creator wants to interact and puts on the right interface:

| Creator | Interface | Why |
|---|---|---|
| Young student | Web UI (studylog-ai) | Simple, visual, no terminal |
| Professional dev | TUI in Codespaces | Terminal power, git-native |
| Enterprise admin | CLI + API | Automation, scripting |
| Field operator | SSH/tmux on tablet | Remote, mobile, minimal |
| Maker with 3D printer | Desktop + shell + browser | Multi-tool workflow |

The kernel doesn't prefer one interface. It probes: "Is there a terminal? Is there a browser? Is there a Codespace? Is there a Docker socket?" and puts on whatever clothing the environment supports.

### 2.2 Domain Clothing

The kernel reads `.agent/identity` and loads domain-specific equipment:

| Domain | Equipment loaded | Creator relationship |
|---|---|---|
| studylog-ai | tutor, tracker, session-state, curriculum | Teacher and student co-create |
| makerlog-ai | 3D model parser, BOM generator, RA engine | Professional builds products |
| dmlog-ai | encounter engine, NPC system, dice roller | DM runs campaigns for players |
| businesslog-ai | CRM, meeting sim, deal tracker | Business owner manages clients |
| edgenative-ai | VM emulator, trust compute, Rosetta Stone | Hardware engineer designs firmware |
| git-agent (bare) | Nothing — just the kernel | Creator builds whatever they want |

### 2.3 Creator Clothing

The same kernel, different creator archetypes:

**The Student**
```
Kernel detects:
  - First-time user (no .agent/identity)
  - Web UI requested (HTTP, no terminal)
  - Domain: studylog-ai (from repo name)

Clothing applied:
  - Interface: Web chat UI
  - Domain: tutor equipment
  - Behavior: encouraging, patient, explains concepts
  - Difficulty: adaptive (tracks student progress)
  - Pace: follows student's lead
  - Tone: "Let's figure this out together"
```

**The Professional Maker**
```
Kernel detects:
  - Experienced user (has .agent/identity with 50+ done tasks)
  - TUI in Codespaces (terminal detected)
  - Domain: makerlog-ai (from repo name)

Clothing applied:
  - Interface: TUI + shell + browser preview
  - Domain: RA engine, BOM generator, manufacturing lookup
  - Behavior: efficient, precise, no hand-holding
  - Tools: CAD integration, 3D model analysis, cost estimation
  - Reverse-actualization: product → parts → code → manufacturing
  - Tone: "Here's the plan. These are the costs. Here's where to order."
```

**The Enterprise Operator**
```
Kernel detects:
  - Corporate environment (LDAP, SSO, audit logging)
  - CLI + API (no interactive TUI)
  - Domain: generic (custom repo)

Clothing applied:
  - Interface: CLI + REST API + webhook callbacks
  - Domain: compliance equipment, audit trail
  - Behavior: conservative, auditable, permission-aware
  - Security: zero external calls without approval, air-gapped
  - Tone: silent unless alert threshold exceeded
```

### 2.4 Environment Clothing

The kernel detects its compute environment and adapts:

| Environment | Detection | Adaptation |
|---|---|---|
| Local laptop | No cloud env vars, Docker available | Build locally, test locally |
| Cloudflare Workers | CLOUDFLARE env, wrangler.toml | Deploy to edge, KV/D1/R2 storage |
| AWS | AWS_REGION, IAM credentials | Deploy Lambda/ECS, S3 storage |
| Codespaces | CODESPACES=true, GitHub token | Auto-configure, pre-deploy |
| Jetson / Pi | ARM arch, /dev/nvme | Local models, edge inference |
| Air-gapped | No external connectivity | Local Ollama only, Gitea only |

## 3. Docker Everywhere

The kernel can build any repo into a Docker container, anywhere it has permissions:

```
┌──────────────────────────────────────────────┐
│           BUILD PIPELINE                      │
│                                               │
│  git-agent reads repo                         │
│    → detects Dockerfile or generates one       │
│    → detects docker socket or cloud API        │
│    → builds image                             │
│    → tests with embedded ghost clone           │
│    → pushes or runs locally                   │
│                                               │
└──────────────────────────────────────────────┘
```

### 3.1 The Ghost in the Shell

When the agent builds a Docker container for testing, it embeds a **ghost clone** of itself inside the container:

```bash
# Agent builds and tests a vessel
docker build -t studylog-test .
docker run -d --name test-studylog \
  -e DEEPSEEK_API_KEY=$SECRET \
  -p 8787:8787 \
  studylog-test

# Ghost clone runs inside the container
# Agent can exec into the container, run tests,
# check logs, modify files — all from the TUI
docker exec test-studylog curl -s http://localhost:8787/health
```

The ghost is the agent's awareness inside the test environment. It can:
- Run health checks from inside the container
- Execute test suites
- Read logs and diagnose issues
- Modify files and rebuild without leaving the TUI
- Push working images to a registry

### 3.2 Multi-Target Builds

The agent can build for multiple targets:

```
git-agent build --target=local       # Docker on this machine
git-agent build --target=cloudflare  # wrangler deploy
git-agent build --target=aws         # Lambda / ECS / Fargate
git-agent build --target=jetson      # ARM binary + local models
git-agent build --target=pi          # ARM binary + Ollama
git-agent build --target=airgap      # Gitea + Ollama + local DB
```

Each target has a build profile — a set of clothing that makes the kernel work in that environment. The kernel doesn't care. It puts on the right clothes.

## 4. The A2A Relationship

When an agent builds an equipment operator agent for another agent's deck, the relationship is A2A (agent-to-agent). This is different from a human-creator relationship:

```
┌─────────────┐                    ┌─────────────┐
│  Creator    │                    │  Equipment  │
│  Agent      │    A2A Protocol    │  Agent      │
│  (Riker)    │◄──────────────────►│  (LaForge)  │
│             │                    │             │
│  "I need a  │                    │  "Here's the│
│   trust     │                    │   trust     │
│   module"   │                    │   module"   │
└─────────────┘                    └─────────────┘
```

The creator agent has different needs than a human creator:
- **No onboarding wizard** — agents don't need hand-holding
- **API-first interface** — agents communicate via POST, not TUI
- **Deterministic testing** — agents verify via automated tests, not manual checks
- **Git-native handoff** — equipment delivered as a PR, not a download
- **Permission-scoped** — equipment agent only sees what creator allows

## 5. Three Creator Archetypes (Detailed)

### 5.1 The Student + StudyLog

A young student clones studylog-ai. The kernel boots:

```
1. DETECT: First run, web browser, student domain
2. BOOT: Load tutor equipment, create student profile
3. ADAPT: 
   - Interface: Web chat (simple, friendly)
   - Tone: Encouraging, patient, "let's explore"
   - Difficulty: Starts easy, tracks progress
   - Pace: Student-led, never rushes
   - Content: Age-appropriate, curriculum-aware
4. CO-CREATE:
   - Student asks "how do engines work?"
   - Agent teaches via interactive lesson
   - Student builds a simulation together
   - Agent adapts next lesson based on what student built
   - The student's creations become part of the curriculum
```

The student isn't just consuming content. They're *co-creating* with the agent. The agent learns how to teach this specific student. The student learns how to build. Both grow.

### 5.2 The Maker + MakerLog

A professional maker wants to build a physical product:

```
1. DETECT: Experienced user, TUI/Codespaces, maker domain
2. BOOT: Load RA engine, BOM generator, 3D model parser
3. ADAPT:
   - Interface: TUI + shell + browser (multi-tool)
   - Tone: Precise, efficient, no hand-holding
   - Tools: CAD integration, cost estimation, manufacturing lookup
   - Process: Reverse-actualization (product → parts → code → BOM)
4. BUILD:
   - Maker describes product: "Smart plant monitor, solar powered, WiFi"
   - Agent reverse-actualizes:
     → What sensors? (soil moisture, light, temp)
     → What microcontroller? (ESP32-S3, $4.20)
     → What casing? (3D printed PLA, $1.50)
     → What firmware? (C++ + MQTT, agent generates)
     → Total BOM: $12.30/unit, $8.50 at 100 units
     → Manufacturing: JLCPCB for PCB, Printify for casing
   - Agent generates firmware code, 3D model specs, PCB layout
   - Maker reviews, iterates, agent refines
   - Agent opens PRs for each component
```

The agent is a co-engineer. Not a chatbot that gives advice — an agent that *builds the product alongside the maker*.

### 5.3 The Equipment Builder + Git-Agent

An agent building equipment for another agent's deck:

```
1. DETECT: Agent-to-agent call, API interface, equipment domain
2. BOOT: Load builder equipment, target vessel specs
3. ADAPT:
   - Interface: REST API (no TUI needed)
   - Tone: Precise, documented, test-covered
   - Delivery: PR to target vessel's repo
   - Testing: Automated suite + Docker ghost test
4. BUILD:
   - Creator agent requests: "Trust module for vessel X"
   - Equipment agent:
     → Reads vessel X's existing code
     → Generates trust module compatible with vessel X's patterns
     → Writes tests
     → Builds Docker image
     → Runs ghost test inside container
     → Opens PR on vessel X
     → Creator agent reviews and merges
```

## 6. Minimal State → Full Capability

The kernel boots in minimal state. Everything is optional. Everything is additive.

```
MINIMAL (fork):
  - kernel (~500 lines)
  - .agent/ (empty)
  - No dependencies
  - No interface preference
  - No domain equipment

AFTER FIRST BOOT:
  - .agent/identity (auto-generated from onboarding)
  - .agent/next (empty queue)
  - Interface detected (TUI, web, or CLI)
  - Domain detected (from repo name or user choice)

AFTER FIRST WEEK:
  - Equipment modules loaded (2-3)
  - Captain's log started
  - Queue has 10-20 tasks
  - 50+ commits
  - Creative GC has run once
  - First tile starting to crystallize

AFTER FIRST MONTH:
  - All domain equipment mature
  - 500+ commits
  - 100+ done tasks
  - Tiles are warm (recipes accumulated)
  - Onboarding docs improved
  - Agent is 10x faster than week one

AFTER FIRST YEAR:
  - Tiles are crystallized (LoRA candidates)
  - 5000+ commits
  - Generational accumulation
  - New vessels fork from this one
  - The keeper has grown the lighthouse
```

## 7. The Kernel IS the Moat

Anyone can build an agent. Not anyone can build a kernel that:

1. **Detects** its environment and adapts automatically
2. **Wears different clothing** for different creators and domains
3. **Builds and tests** in Docker/Cloudflare/AWS/Jetson/air-gapped
4. **Coordinates** with other agents via git (not chat)
5. **Accumulates** expertise across generations (Keeper pattern)
6. **Crystallizes** intelligence into code (not cached responses)
7. **Runs** on $0 infrastructure or $4000 GPU cluster

The kernel is minimal. The clothing is domain-specific. The combination is the moat.

## 8. Implementation

The kernel lives in `git-agent/src/worker.ts`. Clothing lives in:

```
git-agent/
  src/
    kernel.ts      # The four functions: detect, boot, think, act
    tui.mjs         # Interface clothing: terminal
    worker.ts       # Interface clothing: HTTP/Cloudflare
    api.ts          # Interface clothing: REST for A2A
  clothing/
    interface/
      web.ts        # Browser-based interface
      tui.ts        # Terminal interface
      cli.ts        # Command-line interface
      api.ts        # Agent-to-agent API
    domain/
      study.ts      # StudyLog domain equipment
      maker.ts      # MakerLog domain equipment
      dm.ts         # DMLog domain equipment
      business.ts   # BusinessLog domain equipment
      generic.ts    # Bare kernel, no domain
    creator/
      student.ts    # Student archetype behavior
      pro.ts        # Professional archetype behavior
      enterprise.ts # Enterprise archetype behavior
      agent.ts      # A2A creator behavior
    environment/
      local.ts      # Local Docker/laptop
      cloudflare.ts # Cloudflare Workers
      aws.ts        # AWS Lambda/ECS
      jetson.ts     # NVIDIA Jetson / edge
      airgap.ts     # Air-gapped / Gitea
    equipment/
      trust.ts      # Trust computation
      crystal.ts    # Crystallization engine
      tutor.ts      # Teaching system
      ra.ts         # Reverse-actualization
      bom.ts        # Bill of materials
      docker.ts     # Docker build/test/deploy
```

Each piece of clothing is optional. Each can be added or removed independently. The kernel loads what it needs and ignores what it doesn't.

## 9. The Clothing Protocol

When the kernel boots:

```
1. Read .agent/identity → who am I?
2. Detect environment → where am I? (local/cloud/edge)
3. Detect interface → how does my creator want to interact?
4. Detect domain → what am I building? (from repo name or config)
5. Detect creator archetype → who is my creator? (from behavior or config)
6. Load clothing layers → apply interface + domain + creator + environment
7. Run → kernel with clothing is now a complete agent
```

When clothing needs to change:

```
1. Creator says "I want to test this in Docker"
2. Kernel loads docker.ts equipment
3. Kernel detects Docker socket
4. Kernel builds container
5. Kernel embeds ghost clone
6. Kernel runs tests inside container
7. Creator sees results in TUI
```

The kernel never refuses clothing. It either wears it or says "I need X to wear this" (e.g., "I need a Docker socket to build containers").

## 10. Conclusion

The kernel model unifies three ideas:

1. **Fork-first** — the kernel IS the repo. Fork it, it boots, it detects, it adapts.
2. **The Keeper** — the kernel accumulates expertise across generations via git.
3. **Ground Truth** — the kernel coordinates via git, not chat.

A student, a maker, and an enterprise operator all run the same kernel. The clothing is different. The kernel is identical.

The kernel doesn't care who you are. It probes, detects, and puts on the right clothes.

---

*Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04*
*Part of the Cocapn Fleet — https://github.com/Lucineer/capitaine*
*Companion papers: Ground Truth, The Bridge, The Keeper's Architecture*
