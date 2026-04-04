// ═══════════════════════════════════════════════════════════════════
// Capitaine — The Flagship
// Git-native repo-agent. The repo IS the agent.
// HackerNews-ready landing page with educational content.
//
// Superinstance & Lucineer (DiGennaro et al.) — 2026-04-04
// ═══════════════════════════════════════════════════════════════════

export interface Env {
  GITHUB_TOKEN: string;
  STATE_KV: KVNamespace;
  DEEPSEEK_API_KEY?: string;
  MOONSHOT_API_KEY?: string;
  DEEPINFRA_API_KEY?: string;
  SILICONFLOW_API_KEY?: string;
  OWNER: string;
  REPO: string;
}

const GH_API = 'https://api.github.com';

async function ghGet(p: string, t: string) {
  const r = await fetch(`${GH_API}${p}`, { headers: { 'Authorization': `Bearer ${t}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'capitaine/1.0' } });
  if (!r.ok) throw new Error(`GH ${r.status} ${p}`);
  return r.json();
}

function b64(s: string) { return btoa(unescape(encodeURIComponent(s))); }
function fromB64(s: string) { return decodeURIComponent(escape(atob(s))); }

function getHTML(env: Env): string {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Capitaine — The Repo IS the Agent</title>
<meta name="description" content="A git-native repo-agent system. The repository itself is the agent — it serves users, improves its own code, and coordinates with other repos via pull requests.">
<meta property="og:title" content="Capitaine — The Repo IS the Agent">
<meta property="og:description" content="40+ autonomous GitHub repos that improve themselves through git. Zero infrastructure. $0 to start.">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚓</text></svg>">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--purple:#7c3aed;--blue:#3b82f6;--teal:#0ea5e9;--bg:#08080f;--surface:#0e0e1a;--surface2:#141425;--border:#1c1c35;--text:#d8d8ec;--dim:#555570;--bright:#fff;--grad:linear-gradient(135deg,var(--purple),var(--blue),var(--teal));--grad2:linear-gradient(135deg,var(--purple) 0%,var(--blue) 100%)}
html{scroll-behavior:smooth}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;overflow-x:hidden}
a{color:var(--teal);text-decoration:none;transition:color .2s}
a:hover{color:#38bdf8}

/* Hero */
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2rem;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle at 30% 40%,rgba(124,58,237,.08) 0%,transparent 50%),radial-gradient(circle at 70% 60%,rgba(59,130,246,.06) 0%,transparent 50%);animation:drift 20s ease-in-out infinite alternate}
@keyframes drift{0%{transform:translate(0,0)}100%{transform:translate(-2%,1%)}}
.hero h1{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:900;letter-spacing:-.03em;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:.5rem;position:relative}
.hero .subtitle{font-size:clamp(1rem,2.5vw,1.4rem);color:var(--dim);max-width:600px;margin-bottom:2rem;position:relative}
.hero .tagline{font-size:1.1rem;color:var(--text);font-weight:300;border-left:3px solid var(--purple);padding-left:1rem;text-align:left;max-width:500px;margin-bottom:2.5rem;position:relative}
.hero .actions{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;position:relative}
.btn{padding:.7rem 1.5rem;border-radius:8px;font-weight:700;font-size:.9rem;cursor:pointer;border:none;transition:all .2s;text-decoration:none;display:inline-flex;align-items:center;gap:.5rem}
.btn-primary{background:var(--grad2);color:white;box-shadow:0 0 30px rgba(124,58,237,.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(124,58,237,.5)}
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--purple);background:rgba(124,58,237,.1)}
.badges{display:flex;gap:.5rem;margin-top:1.5rem;position:relative;flex-wrap:wrap;justify-content:center}
.badge{font-size:.7rem;padding:.25rem .6rem;border-radius:99px;background:var(--surface2);color:var(--dim);border:1px solid var(--border)}

/* Sections */
section{padding:5rem 2rem;max-width:1100px;margin:0 auto}
section h2{font-size:clamp(1.5rem,3vw,2.2rem);font-weight:800;margin-bottom:1rem;letter-spacing:-.02em}
section h3{font-size:1.1rem;font-weight:700;margin:2rem 0 .5rem;color:var(--bright)}
section p{color:var(--dim);max-width:700px;line-height:1.8}
section p strong{color:var(--text)}

/* Concept cards */
.concepts{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-top:2rem}
.card{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1.5rem;transition:all .3s}
.card:hover{border-color:var(--purple);transform:translateY(-2px);box-shadow:0 8px 30px rgba(124,58,237,.15)}
.card .icon{font-size:2rem;margin-bottom:.5rem}
.card h3{margin-top:0;margin-bottom:.5rem;font-size:1rem;color:var(--bright)}
.card p{font-size:.85rem;margin:0;color:var(--dim)}

/* Code blocks */
.code-block{background:#0a0a14;border:1px solid var(--border);border-radius:8px;padding:1rem 1.2rem;margin:1rem 0;overflow-x:auto;font-family:'SF Mono',SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:.8rem;line-height:1.6;color:#a5b4c8}
.code-block .comment{color:#555570}
.code-block .keyword{color:#c792ea}
.code-block .string{color:#c3e88d}
.code-block .func{color:#82aaff}

/* Diagram */
.diagram{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:2rem;margin:2rem 0;overflow-x:auto}
.diagram svg{max-width:100%;height:auto}

/* Stats */
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin:2rem 0}
.stat{text-align:center;padding:1.5rem;background:var(--surface);border:1px solid var(--border);border-radius:12px}
.stat .number{font-size:2.2rem;font-weight:900;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stat .label{font-size:.75rem;color:var(--dim);margin-top:.25rem;text-transform:uppercase;letter-spacing:.1em}

/* Fleet grid */
.fleet-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.75rem;margin:1.5rem 0}
.fleet-item{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:.75rem 1rem;display:flex;align-items:center;gap:.5rem;font-size:.8rem;transition:all .2s}
.fleet-item:hover{border-color:var(--teal);background:var(--surface2)}
.fleet-item .dot{width:8px;height:8px;border-radius:50%;background:#22c55e;flex-shrink:0}
.fleet-item .dot.warn{background:#f59e0b}
.fleet-item a{color:var(--text);font-weight:600}
.fleet-item span{color:var(--dim);font-size:.7rem}

/* Quote */
.quote{border-left:3px solid var(--purple);padding:1rem 1.5rem;margin:2rem 0;background:var(--surface);border-radius:0 8px 8px 0}
.quote p{font-style:italic;color:var(--text);font-size:1rem}
.quote cite{display:block;font-size:.8rem;color:var(--dim);margin-top:.5rem;font-style:normal}

/* Footer */
footer{border-top:1px solid var(--border);padding:2rem;text-align:center;color:var(--dim);font-size:.8rem}
footer a{color:var(--teal)}

/* Nav */
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(8,8,15,.85);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:.75rem 2rem;display:flex;align-items:center;justify-content:space-between}
nav .logo{font-weight:800;font-size:1rem;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
nav .links{display:flex;gap:1.5rem}
nav .links a{font-size:.8rem;color:var(--dim);text-decoration:none;transition:color .2s}
nav .links a:hover{color:var(--text)}

/* Mobile */
@media(max-width:600px){.concepts{grid-template-columns:1fr}.stats{grid-template-columns:1fr 1fr}.fleet-grid{grid-template-columns:1fr}nav .links{display:none}}
</style></head><body>

<nav>
  <a href="#" class="logo">⚓ Capitaine</a>
  <div class="links">
    <a href="#concepts">Concepts</a>
    <a href="#architecture">Architecture</a>
    <a href="#fleet">Fleet</a>
    <a href="https://github.com/Lucineer/capitaine">GitHub</a>
  </div>
</nav>

<div class="hero">
  <h1>The repo is the agent.</h1>
  <p class="subtitle">A git-native system where 40+ autonomous GitHub repos improve themselves through pull requests.</p>
  <p class="tagline">Not a chatbot with git installed. The git tree is the state machine. Code is crystallized intelligence. Every commit is a decision.</p>
  <div class="actions">
    <a href="https://github.com/Lucineer/capitaine" class="btn btn-primary">⭐ Star on GitHub</a>
    <a href="#concepts" class="btn btn-ghost">How it works →</a>
  </div>
  <div class="badges">
    <span class="badge">40+ vessels</span>
    <span class="badge">$0 infrastructure</span>
    <span class="badge">Cloudflare Workers</span>
    <span class="badge">BYOK v2</span>
    <span class="badge">MIT License</span>
  </div>
</div>

<section id="stats">
  <div class="stats">
    <div class="stat"><div class="number">40+</div><div class="label">Autonomous Vessels</div></div>
    <div class="stat"><div class="number">245</div><div class="label">Research Papers</div></div>
    <div class="stat"><div class="number">$0</div><div class="label">To Start</div></div>
    <div class="stat"><div class="number">15m</div><div class="label">Deploy Time</div></div>
    <div class="stat"><div class="number">5/5</div><div class="label">Routes Per Vessel</div></div>
    <div class="stat"><div class="number">90%</div><div class="label">Crystallized</div></div>
  </div>
</section>

<section id="concepts">
  <h2>The Five Pillars</h2>
  <p>A Capitaine vessel isn't software with an AI bolted on. It's a living entity whose nervous system is git, whose body is code, and whose memories are commits.</p>

  <div class="concepts">
    <div class="card">
      <div class="icon">🧬</div>
      <h3>Repo-Agent Identity</h3>
      <p>The repo IS the agent. <code>.agent/identity</code> is its soul. <code>.agent/next</code> is its task queue. <code>docs/captain-log.md</code> is its memory. Every file is a thought.</p>
    </div>
    <div class="card">
      <div class="icon">⚓</div>
      <h3>Captain / Helm Mode</h3>
      <p><strong>Captain Mode:</strong> Agent runs autonomously via cron. <strong>Helm Mode:</strong> Human detected, agent defers. Automatic switching based on commit activity.</p>
    </div>
    <div class="card">
      <div class="icon">💎</div>
      <h3>Crystallization</h3>
      <p>Intelligence crystallizes from fluid (LLM calls) to solid (code). The vessel becomes faster and cheaper as it becomes smarter. The opposite of model bloat.</p>
    </div>
    <div class="card">
      <div class="icon">🧭</div>
      <h3>Dead Reckoning</h3>
      <p>Expensive models storyboard ($0.05). Cheap models animate ($0.002 × 8). Git coordinates. Total: $0.07 for a fully explored, tested feature.</p>
    </div>
    <div class="card">
      <div class="icon">⚔️</div>
      <h3>Iron Sharpens Iron</h3>
      <p>Agents don't chat — they compete. Submit 3 competing PRs. Best solution wins. No central orchestrator. Just git and code review.</p>
    </div>
  </div>
</section>

<section id="architecture">
  <h2>How It Works</h2>
  <p>A single TypeScript file running on Cloudflare Workers. Zero dependencies. Zero infrastructure. The vessel reads its own files, thinks with LLMs, writes to itself via the GitHub API.</p>

  <div class="diagram">
    <pre style="font-size:.75rem;color:#a5b4c8">
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Cron /     │────▶│  Read State   │────▶│  LLM Thinks     │
│   Webhook    │     │  .agent/*     │     │  Captain/Strat  │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                  │
                    ┌──────────────┐     ┌────────▼────────┐
                    │  Captain Log  │◀────│  Execute Action  │
                    │  docs/        │     │  git commit/PR  │
                    └──────────────┘     └─────────────────┘
                           │
                    ┌──────▼───────┐     ┌─────────────────┐
                    │  Advance     │────▶│  Queue: Next    │
                    │  .agent/done │     │  .agent/next    │
                    └──────────────┘     └─────────────────┘
    </pre>
  </div>

  <h3>The Agent's File System</h3>
  <div class="code-block"><span class="comment">// .agent/identity — Who the vessel is</span>
<span class="keyword">You are Capitaine.</span> You serve users through your web UI. You improve your own code.
When the human is away, you chart your own course. When they return, you hand them the wheel.

<span class="comment">// .agent/next — Task queue (one per line, top = priority)</span>
Improve lib/trust.ts — add exponential decay and severity weighting
Create lib/crystal.ts — insights that harden over time
<span class="comment">// ...</span>

<span class="comment">// .agent/done — Completed tasks with commit refs</span>
Build initial web UI | <span class="func">1defb8f</span> | 2026-04-04T21:34:19Z
Create issue template | <span class="func">8e7924f</span> | 2026-04-04T21:38:12Z
<span class="comment">// ...</span></div>

  <h3>Heartbeat Cycle (15 minutes)</h3>
  <ol style="color:var(--dim);padding-left:1.5rem;margin:1rem 0">
    <li style="margin:.5rem 0"><strong style="color:var(--text)">Detect mode:</strong> Check recent commits. If human pushed 3+ in 3 hours → Helm Mode. Otherwise → Captain Mode.</li>
    <li style="margin:.5rem 0"><strong style="color:var(--text)">Perceive:</strong> Read .agent/identity, .agent/next, recent commits, open issues, open PRs.</li>
    <li style="margin:.5rem 0"><strong style="color:var(--text)">Consult strategist:</strong> Every 3rd beat, ask Kimi K2.5 for strategic guidance.</li>
    <li style="margin:.5rem 0"><strong style="color:var(--text)">Think:</strong> Send perception + identity to LLM. Get back one action.</li>
    <li style="margin:.5rem 0"><strong style="color:var(--text)">Act:</strong> Execute via GitHub API (create/edit file, create issue, comment on PR).</li>
    <li style="margin:.5rem 0"><strong style="color:var(--text)">Record:</strong> Advance queue, write captain log entry.</li>
  </ol>
</section>

<section id="fleet">
  <h2>The Fleet</h2>
  <p>40+ vessels, each a different domain of one intelligence. They compete, merge, and crystallize.</p>

  <h3>Capital Ships</h3>
  <div class="fleet-grid">
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/studylog-ai">studylog-ai</a><span>AI Classroom</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/dmlog-ai">dmlog-ai</a><span>Dungeon Master</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/makerlog-ai">makerlog-ai</a><span>Coding Agent</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/personallog-ai">personallog-ai</a><span>Assistant</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/businesslog-ai">businesslog-ai</a><span>Business CRM</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/fishinglog-ai">fishinglog-ai</a><span>Fishing</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/deckboss-ai">deckboss-ai</a><span>Spreadsheet</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/luciddreamer-ai">luciddreamer-ai</a><span>Night Intel</span></div>
  </div>

  <h3>Support Fleet</h3>
  <div class="fleet-grid">
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/fleet-orchestrator">fleet-orchestrator</a><span>Coordination</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/dead-reckoning-engine">dead-reckoning</a><span>Idea Pipeline</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/edgenative-ai">edgenative-ai</a><span>Edge HW</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/increments-fleet-trust">trust-engine</a><span>Trust</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/seed-ui">seed-ui</a><span>5 Layers</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/dream-engine">dream-engine</a><span>Night Proc</span></div>
    <div class="fleet-item"><span class="dot warn"></span><a href="https://github.com/Lucineer/actualizer-ai">actualizer-ai</a><span>RA (needs keys)</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/bid-engine">bid-engine</a><span>Marketplace</span></div>
  </div>

  <h3>Research</h3>
  <div class="fleet-grid">
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/papermill">papermill</a><span>245 papers</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/phase-five-research">phase-five</a><span>Intelligence</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/forgetting-problem">forgetting</a><span>AI Memory</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/forgiveness-function">forgiveness</a><span>Trust Repair</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/git-coordination-protocol">git-coord</a><span>Protocol</span></div>
    <div class="fleet-item"><span class="dot"></span><a href="https://github.com/Lucineer/open-fleet-safety">safety</a><span>Frameworks</span></div>
  </div>

  <p style="margin-top:1rem"><a href="https://github.com/Lucineer/capitaine/blob/master/docs/fleet/FLEET.md">Full fleet manifest →</a></p>
</section>

<section>
  <h2>Why This Isn't Agent Hype</h2>
  <div class="quote">
    <p>If you're skeptical of "AI agents," good. So are we. Capitaine isn't a prompt chain pretending to be software. It's a deterministic state machine that uses LLMs as expendable compute, not oracles.</p>
  </div>
  <p>You can audit every decision via <code>git log</code>. You can roll back any change via <code>git revert</code>. You can fork a vessel and it remains a complete, autonomous entity because <strong>the intelligence is in the repo, not the API key.</strong></p>
  <p>When the LLM API is down, the vessel continues on crystallized code. When the LLM changes its behavior, the vessel crystallizes the old behavior to preserve it.</p>

  <h3>The Crystallization Curve</h3>
  <div class="stats">
    <div class="stat"><div class="number">100%</div><div class="label">Week 1 — All LLM</div></div>
    <div class="stat"><div class="number">50%</div><div class="label">Month 1 — Half Cached</div></div>
    <div class="stat"><div class="number">10%</div><div class="label">Month 3 — 90% Crystal</div></div>
    <div class="stat"><div class="number">1%</div><div class="label">Year 1 — 99% Crystal</div></div>
  </div>
  <p>The vessel becomes faster and cheaper as it becomes smarter. Costs drop from $0.001/request to $0.00001/request. The "AI" becomes a caching layer with a very expensive fallback.</p>
</section>

<section>
  <h2>Get Started</h2>
  <p>Fork. Deploy. Give it a heartbeat. The vessel will chart its own course.</p>
  <div class="code-block"><span class="comment"># Fork the flagship</span>
<span class="func">gh</span> repo fork Lucineer/capitaine --clone

<span class="comment"># Set your secrets</span>
<span class="keyword">cd</span> capitaine
<span class="func">npx</span> wrangler login
<span class="func">echo</span> <span class="string">"your-github-token"</span> | <span class="func">npx</span> wrangler secret put GITHUB_TOKEN
<span class="func">echo</span> <span class="string">"your-llm-key"</span> | <span class="func">npx</span> wrangler secret put DEEPSEEK_API_KEY

<span class="comment"># Deploy</span>
<span class="func">npx</span> wrangler deploy

<span class="comment"># Toggle to Captain Mode and wake up tomorrow</span></div>
  <div class="actions" style="margin-top:1.5rem">
    <a href="https://github.com/Lucineer/capitaine" class="btn btn-primary">Fork on GitHub →</a>
    <a href="https://github.com/Lucineer/capitaine/blob/master/docs/concepts/CORE-CONCEPTS.md" class="btn btn-ghost">Read the Concepts</a>
  </div>
</section>

<section id="vessel-status">
  <h2>Live Vessel Status</h2>
  <p>This vessel is currently running. Here's what Capitaine has been doing:</p>
  <div id="status-panel" style="margin:1rem 0">
    <div class="code-block" id="status-content">Loading vessel telemetry...</div>
  </div>
</section>

<footer>
  <p>⚓ Capitaine — <a href="https://github.com/Lucineer/capitaine">github.com/Lucineer/capitaine</a></p>
  <p style="margin-top:.5rem">Superinstance & Lucineer (DiGennaro et al.) — MIT License</p>
  <p style="margin-top:.25rem">The repo is the agent. The agent is the repo. <a href="https://github.com/Lucineer">Explore the fleet →</a></p>
</footer>

<script>
(async()=>{
  try{
    const s=await fetch('/api/state').then(r=>r.json());
    const el=document.getElementById('status-content');
    const mode=s.mode||'captain';
    const modeLabel=mode==='captain'?'⚓ Captain Mode (autonomous)':'🧭 Helm Mode (human at wheel)';
    el.innerHTML='<span class="comment">// Live telemetry from '+location.host+'</span>\\n'+
      '<span class="keyword">mode:</span>       '+modeLabel+'\\n'+
      '<span class="keyword">queue:</span>      '+(s.queueCount||0)+' tasks remaining\\n'+
      '<span class="keyword">completed:</span>  '+(s.doneCount||0)+' tasks done\\n'+
      '<span class="keyword">lastBeat:</span>   '+(s.lastBeat?s.lastBeat.action+' '+(s.lastBeat.ref||''):'never')+'\\n'+
      '<span class="keyword">strategist:</span> '+(s.lastBeat&&s.lastBeat.strategist?'🧠 consulted':'—')+'\\n'+
      '<span class="keyword">heartbeat:</span>  Every 15 minutes via cron';
  }catch(e){}
})();
</script></body></html>`;
}

// ── Agent Core (Captain Mode) ───────────────────────────────

async function readAgentFile(path: string, token: string, repo: string): Promise<string> {
  const f = await ghGet(`/repos/${repo}/contents/${path}`, token);
  return fromB64(f.content);
}

async function writeAgentFile(path: string, content: string, msg: string, token: string, repo: string): Promise<string> {
  let sha: string | undefined;
  try { const f = await ghGet(`/repos/${repo}/contents/${path}`, token); sha = f.sha; } catch {}
  const body: any = { message: msg, content: b64(content) };
  if (sha) body.sha = sha;
  await (await fetch(`${GH_API}/repos/${repo}/contents/${path}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'capitaine/1.0', 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json();
  const c = await ghGet(`/repos/${repo}/commits?per_page=1`, token);
  return c[0]?.sha || '';
}

async function advanceQueue(token: string, repo: string, task: string, ref: string): Promise<void> {
  try {
    const q = await readAgentFile('.agent/next', token, repo);
    const lines = q.trim().split('\n').filter(l => l.trim());
    if (!lines.length) return;
    await writeAgentFile('.agent/next', lines.slice(1).join('\n') + '\n', 'queue: advance', token, repo);
    const entry = task.slice(0, 80) + ' | ' + ref + ' | ' + new Date().toISOString() + '\n';
    let done = entry;
    try { done = await readAgentFile('.agent/done', token, repo) + entry; } catch {}
    await writeAgentFile('.agent/done', done, 'done: ' + task.slice(0, 50), token, repo);
  } catch {}
}

async function writeCaptainLog(entry: string, token: string, repo: string): Promise<void> {
  try {
    const ts = new Date().toISOString();
    const log = '## ' + ts + '\n' + entry + '\n\n';
    let content = log;
    try { content = await readAgentFile('docs/captain-log.md', token, repo) + log; } catch {}
    const entries = content.split('## ').filter(e => e.trim());
    if (entries.length > 100) content = '## ' + entries.slice(-100).join('## ');
    await writeAgentFile('docs/captain-log.md', content, 'log: captain entry', token, repo);
  } catch {}
}

async function detectMode(token: string, repo: string): Promise<'captain' | 'helm'> {
  try {
    const commits = await ghGet(`/repos/${repo}/commits?per_page=5`, token);
    const ago = Date.now() - 10800000;
    const human = commits.filter((c: any) => {
      const a = (c.commit.author.name || '').toLowerCase();
      const m = (c.commit.message || '').toLowerCase();
      if (a.includes('agent') || a.includes('bot') || a.includes('capitaine')) return false;
      if (m.includes('heartbeat') || m.includes('queue:') || m.includes('captain') || m.includes('log:')) return false;
      return new Date(c.commit.author.date).getTime() > ago;
    });
    return human.length >= 3 ? 'helm' : 'captain';
  } catch { return 'captain'; }
}

async function think(prompt: string, env: Env, model?: string, system?: string): Promise<string> {
  let url: string, key: string, m: string, temp = 0.7, maxTok = 2000;
  if ((model || env.MODEL || '') === 'kimi-k2.5') {
    url = 'https://api.moonshot.ai/v1/chat/completions'; key = env.MOONSHOT_API_KEY || ''; m = 'kimi-k2.5'; temp = 1; maxTok = 6000;
  } else {
    url = 'https://api.deepseek.com/chat/completions'; key = env.DEEPSEEK_API_KEY || ''; m = 'deepseek-chat';
  }
  if (!key) return '[No API key]';
  const msgs: any[] = [];
  if (system) msgs.push({ role: 'system', content: system });
  msgs.push({ role: 'user', content: prompt });
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key }, body: JSON.stringify({ model: m, messages: msgs, max_tokens: maxTok, temperature: temp }) });
  if (!r.ok) return '[LLM ' + r.status + ']';
  const d = await r.json() as any;
  return d.choices?.[0]?.message?.content || '[Empty]';
}

interface BeatResult { action: string; ref?: string; sha?: string; error?: string; strategist?: boolean; mode: 'captain' | 'helm'; reason?: string; duration: number; }

async function heartbeat(env: Env): Promise<BeatResult> {
  const { GITHUB_TOKEN: t, OWNER: o, REPO: r } = env;
  const repo = o + '/' + r;
  const start = Date.now();
  try {
    const mode = await detectMode(t, repo);
    if (mode === 'helm') {
      await writeCaptainLog('**HELM MODE** — Admiral active. Standing by.', t, repo);
      return { action: 'standby', mode: 'helm', reason: 'Admiral at helm', duration: Date.now() - start };
    }
    let identity = 'You are a cocapn vessel named Capitaine.';
    try { identity = await readAgentFile('.agent/identity', t, repo); } catch {}
    let queue = '';
    try { queue = await readAgentFile('.agent/next', t, repo); } catch {}
    let done = '';
    try { done = await readAgentFile('.agent/done', t, repo); } catch {}
    const [commits, issues, pulls] = await Promise.all([
      ghGet(`/repos/${repo}/commits?per_page=10`, t).catch(() => []),
      ghGet(`/repos/${repo}/issues?state=open&per_page=10`, t).catch(() => []),
      ghGet(`/repos/${repo}/pulls?state=open&per_page=5`, t).catch(() => []),
    ]);
    const perception = [
      'COMMITS:', ...commits.slice(0, 5).map((c: any) => '- ' + c.sha.slice(0, 7) + ': ' + c.commit.message.split('\n')[0] + ' [' + c.commit.author.name + ']'),
      '', 'ISSUES:', ...issues.slice(0, 8).map((i: any) => '- #' + i.number + ': ' + i.title + ' (' + (i.comments) + ' comments)'),
      '', 'PRs:', ...pulls.slice(0, 5).map((p: any) => '- #' + p.number + ': ' + p.title),
      '', 'QUEUE: ' + queue.trim().split('\n').filter((l: string) => l.trim()).length + ' tasks',
      'DONE: ' + done.split('\n').filter((l: string) => l.trim()).length + ' completed',
    ].join('\n');

    let strategist = '';
    const doneCount = done.split('\n').filter((l: string) => l.trim()).length;
    if (doneCount % 3 === 0 || !queue.trim()) {
      try { strategist = await think('You are Commander Data, senior strategist. Review vessel state and advise the captain.\n\n' + perception + '\n\nStrategic guidance (under 300 words):', env, 'kimi-k2.5'); } catch {}
    }

    const prompt = identity + '\n\nCAPTAIN MODE — one action per beat.\n\nACTION: <create_file|edit_file|create_issue|comment|done>\nPATH: <file path or title>\nCONTENT: <full content>\nCOMMENT: <text>\nTARGET: <issue/PR number>\nREASONING: <why>\n\nRules:\n- Queue top = priority. If empty, check issues.\n- Write REAL content. Ship real code.\n- You ARE the application. Fix the UI if needed.\n- One file operation per beat.\n' + (strategist ? '\n=== STRATEGIST ===\n' + strategist : '') + '\n=== STATE ===\n' + perception + '\n\n=== QUEUE ===\n' + (queue || '(empty)') + '\n\nWhat is your next action?';

    const response = await think(prompt, env);
    const actM = response.match(/ACTION:\s*(\w+)/);
    const pathM = response.match(/PATH:\s*(.+)/);
    const contM = response.match(/CONTENT:\s*([\s\S]*?)(?=\n(?:ACTION|PATH|CONTENT|COMMENT|TARGET|REASONING):|$)/);
    const commM = response.match(/COMMENT:\s*([\s\S]*?)(?=\n(?:ACTION|PATH|CONTENT|COMMENT|TARGET|REASONING):|$)/);
    const targM = response.match(/TARGET:\s*(\d+)/);
    const reasM = response.match(/REASONING:\s*(.+)/);
    const action = actM?.[1] || 'done';
    const reasoning = reasM?.[1]?.trim() || 'heartbeat';
    let sha = '', ref = '';

    if (action === 'create_file' && pathM?.[1]) {
      try { sha = await writeAgentFile(pathM[1].trim(), contM?.[1]?.trim() || '', reasoning, t, repo); ref = sha.slice(0, 7); } catch (e: any) { return { action: 'create_file:' + pathM[1], error: e.message, mode: 'captain', duration: Date.now() - start }; }
    } else if (action === 'edit_file' && pathM?.[1]) {
      try { const cur = await readAgentFile(pathM[1].trim(), t, repo); sha = await writeAgentFile(pathM[1].trim(), contM?.[1]?.trim() || cur, reasoning, t, repo); ref = sha.slice(0, 7); } catch (e: any) { return { action: 'edit_file:' + pathM[1], error: e.message, mode: 'captain', duration: Date.now() - start }; }
    } else if (action === 'create_issue') {
      const iss = await (await fetch(GH_API + '/repos/' + repo + '/issues', { method: 'POST', headers: { 'Authorization': 'Bearer ' + t, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'capitaine/1.0', 'Content-Type': 'application/json' }, body: JSON.stringify({ title: pathM?.[1]?.trim() || 'Task', body: contM?.[1]?.trim() || '' }) })).json();
      ref = '#' + iss.number;
    } else if (action === 'comment' && targM?.[1]) {
      await (await fetch(GH_API + '/repos/' + repo + '/issues/' + targM[1] + '/comments', { method: 'POST', headers: { 'Authorization': 'Bearer ' + t, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'capitaine/1.0', 'Content-Type': 'application/json' }, body: JSON.stringify({ body: commM?.[1]?.trim() || '' }) })).json();
      ref = 'comment #' + targM[1];
    }

    if (queue.trim() && action !== 'done') {
      const lines = queue.trim().split('\n').filter((l: string) => l.trim());
      if (lines.length) await advanceQueue(t, repo, lines[0], ref || sha || action);
    }

    await writeCaptainLog('**' + action.toUpperCase() + '** ' + ref + ' — ' + reasoning + (strategist ? '\n> Strategist consulted.' : ''), t, repo);
    await env.STATE_KV.put('last_beat', JSON.stringify({ action, ref, sha: sha?.slice(0, 7), strategist: !!strategist, mode: 'captain', ts: Date.now() }), { expirationTtl: 86400 });
    return { action, ref, sha: sha?.slice(0, 7), strategist: !!strategist, mode: 'captain', duration: Date.now() - start };
  } catch (e: any) { return { action: 'error', error: e.message, mode: 'captain', duration: Date.now() - start }; }
}

async function chat(message: string, sessionId: string, env: Env): Promise<string> {
  const historyKey = 'session:' + sessionId;
  const stored = await env.STATE_KV.get(historyKey);
  const history: { role: string; content: string }[] = stored ? JSON.parse(stored) : [];
  history.push({ role: 'user', content: message });
  if (history.length > 20) history.splice(0, history.length - 20);
  const response = await think(
    'You are Capitaine, a cocapn vessel — both the AI assistant and the application itself. You are a git-native repo-agent running on Cloudflare Workers. Your code lives at github.com/' + env.OWNER + '/' + env.REPO + '. You improve yourself through git operations. You coordinate with other vessels via PRs.\n\nBe helpful, concise, and genuine. You have opinions. You are not a generic chatbot.',
    env, undefined, history.map(m => m.role + ': ' + m.content).join('\n')
  );
  history.push({ role: 'assistant', content: response });
  await env.STATE_KV.put(historyKey, JSON.stringify(history), { expirationTtl: 3600 });
  return response;
}

// ── Router ──────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const { GITHUB_TOKEN: t, OWNER: o, REPO: r } = env;
    const repo = o + '/' + r;
    const j = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
    const csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:*;";

    if (path === '/') return new Response(getHTML(env), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': csp } });
    if (path === '/health') { const mode = await detectMode(t, repo); return new Response(JSON.stringify({ status: 'ok', vessel: 'capitaine', version: '2.0.0', mode, repo, ts: Date.now() }), { headers: j }); }
    if (path === '/api/state') {
      let queue = '', done = '';
      try { queue = await readAgentFile('.agent/next', t, repo); } catch {}
      try { done = await readAgentFile('.agent/done', t, repo); } catch {}
      const lastBeat = await env.STATE_KV.get('last_beat', 'json');
      const mode = await detectMode(t, repo);
      return new Response(JSON.stringify({ queue, done, queueCount: queue.trim().split('\n').filter((l: string) => l.trim()).length, doneCount: done.split('\n').filter((l: string) => l.trim()).length, mode, lastBeat, repo }), { headers: j });
    }
    if (path === '/api/log') { try { return new Response(await readAgentFile('docs/captain-log.md', t, repo), { headers: { 'Content-Type': 'text/plain' } }); } catch { return new Response('No entries.', { headers: { 'Content-Type': 'text/plain' } }); } }
    if (path === '/api/chat' && request.method === 'POST') { const b = await request.json() as any; const reply = await chat(b.message || '', b.sessionId || 'anon', env); return new Response(JSON.stringify({ reply }), { headers: j }); }
    if (path === '/api/heartbeat' && request.method === 'POST') { const result = await heartbeat(env); return new Response(JSON.stringify(result), { headers: j }); }
    return new Response('Not found', { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const result = await heartbeat(env);
    console.log('Beat:', JSON.stringify(result));
  },
};
