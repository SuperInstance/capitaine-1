# Fork-First Enterprise

## Self-Hosted Autonomous Agent Fleet

### The Pitch

Run the entire Cocapn fleet on your own infrastructure. Air-gapped. Zero data leaves the building. Every agent, every vessel, every coordination — inside your network.

Git is the protocol. Gitea is the forge. Ollama is the brain. Your team is the Admiral.

### Architecture

```
┌──────────────────────────────────────────────────┐
│              YOUR NETWORK                         │
│                                                   │
│  ┌──────────┐                                     │
│  │  Gitea   │  Git forge (coordination protocol)  │
│  │  :3000   │  All repos, PRs, issues, secrets    │
│  └────┬─────┘                                     │
│       │                                           │
│  ┌────┴─────┐  ┌──────────┐  ┌──────────┐       │
│  │  Agent 1  │  │  Agent 2  │  │  Agent 3  │      │
│  │  (vessel) │  │  (vessel) │  │  (vessel) │     │
│  │  PAT_A   │  │  PAT_B   │  │  PAT_C   │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │               │
│  ─────┴─────────────┴─────────────┴──────────    │
│              INTERNAL GIT PROTOCOL                │
│         Forks, PRs, Issues, Comments              │
│  ────────────────────────────────────────────     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Ollama   │  │  vLLM    │  │  Qdrant  │       │
│  │ :11434   │  │ :8000    │  │ :6333    │      │
│  │ Local    │  │ Local    │  │ Vector   │      │
│  │ models   │  │ models   │  │ store    │      │
│  └──────────┘  └──────────┘  └──────────┘       │
│                                                   │
│  ┌──────────┐  ┌──────────┐                      │
│  │ GPU      │  │  NAS     │                      │
│  │ Server   │  │ (LoRA    │                      │
│  │ (train)  │  │  archive)│                      │
│  └──────────┘  └──────────┘                      │
│                                                   │
│  ══════════════════════════════════════════════   │
│  FIREWALL — NO DATA LEAVES                        │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Quick Start (30 minutes)

#### 1. Deploy Gitea

```bash
# Single binary, no dependencies
wget -O /usr/local/bin/gitea https://dl.gitea.com/gitea/1.22/gitea-1.22-linux-arm64
chmod +x /usr/local/bin/gitea

# Run with SQLite (no external DB needed)
gitea web --port 3000

# Create admin user
gitea admin user create \
  --username admin \
  --password YOUR_ADMIN_PASSWORD \
  --email admin@yourcompany.com \
  --admin \
  --must-change-password=false
```

Alternatives: Docker (`docker run -d -p 3000:3000 gitea/gitea:latest`), GitLab CE, Forgejo.

#### 2. Create the Fleet Org

```bash
# Via Gitea API
curl -X POST http://localhost:3000/api/v1/orgs \
  -H "Authorization: token YOUR_ADMIN_TOKEN" \
  -d '{"username": "fleet", "visibility": "private", "description": "Autonomous Agent Fleet"}'
```

#### 3. Create Agent Users

```bash
# Each agent is a Gitea user with a PAT
for agent in flux worf data laforge; do
  gitea admin user create \
    --username $agent \
    --password $(openssl rand -hex 16) \
    --email ${agent}@fleet.local \
    --must-change-password=false
  
  # Generate PAT
  curl -X POST http://localhost:3000/api/v1/users/${agent}/tokens \
    -H "Authorization: Basic $(echo -n "${agent}:$(openssl rand -hex 16)" | base64)" \
    -d '{"name": "fleet-pat", "scopes": ["repo", "read:organization"]}'
done
```

#### 4. Seed the Fleet

```bash
# Fork fleet repos into your Gitea instance
for repo in git-agent cocapn-lite; do
  git clone --bare https://github.com/Lucineer/${repo}.git
  cd ${repo}.git
  git push --mirror http://admin:YOUR_ADMIN_PASSWORD@localhost:3000/fleet/${repo}.git
  cd ..
done
```

#### 5. Deploy Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull models (air-gapped: pull before disconnecting)
ollama pull deepseek-r1:32b
ollama pull qwen2.5-coder:32b
ollama pull llama3.1:70b

# Run with GPU
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

#### 6. Configure Agent

```bash
# Clone agent repo
git clone http://admin:PASSWORD@localhost:3000/fleet/git-agent.git
cd git-agent

# Set secrets (agent never sees these)
echo "http://localhost:11434" > .env.local
echo "GITEA_TOKEN=gitea_pat_xxxxx" >> .env.local
echo "OLLAMA_BASE_URL=http://localhost:11434" >> .env.local

# Start
npm start
```

### Production Deployment

#### High Availability

```
┌──────────────────────────────────────────┐
│              LOAD BALANCER                │
│              :443 (HTTPS)                 │
│         ┌────────┬────────┐              │
│         ▼        ▼        ▼              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Gitea 1 │ │  Gitea 2 │ │  Gitea 3 │ │
│  │  (primary)│ │ (replica)│ │ (replica)│ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ │
│       └─────────────┼─────────────┘       │
│                     ▼                      │
│              ┌──────────┐                  │
│              │  MySQL   │                  │
│              │  / PG    │                  │
│              │  (HA)    │                  │
│              └──────────┘                  │
│                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Ollama  │ │  vLLM    │ │  Qdrant  │  │
│  │  GPU #1  │ │  GPU #2  │ │  Vector  │  │
│  └──────────┘ └──────────┘ └──────────┘  │
└──────────────────────────────────────────┘
```

#### Model Routing (Local)

```json
{
  "models": {
    "strategic": "http://gpu-server-1:11434/api/deepseek-r1:32b",
    "tactical": "http://gpu-server-2:8000/v1/qwen2.5-coder:32b",
    "fast": "http://ollama:11434/api/llama3.1:8b",
    "vision": "http://gpu-server-1:11434/api/llava:13b"
  },
  "routing": {
    "reverse_actualization": "strategic",
    "code_generation": "tactical",
    "heartbeat": "fast",
    "image_analysis": "vision"
  }
}
```

#### Secrets Management

| Method | Use Case | Agent Access |
|---|---|---|
| Gitea Secrets | Git Actions CI/CD | Env bindings only |
| HashiCorp Vault | Enterprise secrets | AppRole (no human creds) |
| SOPS + git-crypt | Encrypted config files | Decrypted at deploy time |
| Environment variables | Docker/K8s | Injected by orchestrator |
| `.env.local` (gitignored) | Development | chmod 600, owner only |

**Principle:** Agent receives capabilities through runtime bindings. Never direct access to secrets store. This is how Docker secrets, K8s secrets, and Cloudflare Workers secrets already work.

### Feature Parity with Cloud

| Feature | Cloud (github.com) | Enterprise (Gitea) |
|---|---|---|
| Git coordination | ✅ | ✅ |
| Forks/PRs/Issues | ✅ | ✅ |
| PAT permissions | ✅ | ✅ |
| Secrets store | ✅ | ✅ |
| Webhooks | ✅ | ✅ |
| CI/CD (Actions) | ✅ | ✅ (Gitea Actions) |
| Container registry | ✅ | ✅ |
| Codespaces | ✅ | ❌ (use SSH) |
| Copilot | ✅ | ❌ (use local models) |
| LLM routing | Cloud APIs | Ollama/vLLM |
| Air-gapped | ❌ | ✅ |
| Data sovereignty | ❌ | ✅ |
| Custom branding | ❌ | ✅ |
| Audit logs | ✅ (Enterprise) | ✅ |

### Compliance

- **SOC 2**: Gitea audit logs + Vault secrets + encrypted storage
- **HIPAA**: Air-gapped deployment + no PHI leaves network
- **ITAR**: On-prem + local models + no foreign cloud access
- **GDPR**: Data stays in EU (or any jurisdiction you choose)
- **CMMC**: Access control via PAT scopes + audit trail via git history

### Cost Estimate

| Component | Hardware | Cost |
|---|---|---|
| Gitea server | 2 CPU, 4GB RAM | $0 (existing) |
| Ollama (7B model) | 8GB GPU | $0 (existing Jetson) |
| Ollama (70B model) | 48GB GPU | $500-2000 (one-time) |
| vLLM (serving) | 24GB+ GPU | $500-2000 (one-time) |
| Qdrant (vectors) | 4GB RAM | $0 (existing) |
| NAS (LoRA archive) | 1TB+ | $100 (one-time) |
| **Total** | | **$1100-4100 one-time** |

Compare to: $50/seat/month × 10 seats × 12 months = $6,000/year for cloud agents.

**Payback: 2-7 months.**

### Migration from Cloud

```bash
# 1. Mirror all repos
for repo in $(gh repo list Lucineer --json name -q '.[].name'); do
  git clone --bare https://github.com/Lucineer/${repo}.git
  git push --mirror http://admin:PASSWORD@localhost:3000/fleet/${repo}.git
done

# 2. Export issues/PRs (Gitea has import from GitHub)
# Use Gitea's built-in GitHub migration API

# 3. Switch agent endpoints
# Change OLLAMA_BASE_URL from cloud to local
# Change GITEA_TOKEN from GitHub PAT to Gitea PAT

# 4. Pull local models (before disconnecting)
ollama pull deepseek-r1:32b
ollama pull qwen2.5-coder:32b

# 5. Disconnect from internet
# Everything works. Zero data leaves.
```

### What Changes, What Doesn't

**Doesn't change:**
- Agent code (same worker.ts, same TUI)
- Coordination protocol (git is git)
- Permission model (PAT scopes)
- Memory hierarchy (hot/warm/cold/GC)
- Tile expertise model
- Fork-first philosophy

**Changes:**
- Git host (github.com → internal Gitea)
- LLM provider (Cloud API → Ollama/vLLM)
- Vector store (Cloud → local Qdrant/ChromaDB)
- Deployment (Cloudflare Workers → Docker/K8s/local)
- CI/CD (GitHub Actions → Gitea Actions)

**This is the point.** The architecture is host-agnostic. Git is the protocol. Everything else is pluggable.

---

*Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04*
*Part of the Cocapn Fleet — https://github.com/Lucineer/capitaine*
