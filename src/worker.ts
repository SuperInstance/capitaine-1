// ═══════════════════════════════════════════════════════════════════
// Cocapn Vessel — Argo (Mark I)
// The repo IS the agent. The agent IS the application.
// Git-native repo-agent: serves users, self-improves, coordinates.
//
// Captain Mode: agent runs autonomously (cron heartbeat)
// Helm Mode: human is actively working, agent defers
// Iron-Sharpens-Iron: coordination via PRs, not chat
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
  MODEL?: string;
}

const GH_API = 'https://api.github.com';

// ── GitHub API ──────────────────────────────────────────────

async function ghGet(p: string, t: string) {
  const r = await fetch(`${GH_API}${p}`, { headers: { 'Authorization': `Bearer ${t}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'cocapn-vessel/1.0' } });
  if (!r.ok) throw new Error(`GH ${r.status} ${p}`);
  return r.json();
}
async function ghPost(p: string, t: string, b: any) {
  const r = await fetch(`${GH_API}${p}`, { method: 'POST', headers: { 'Authorization': `Bearer ${t}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'cocapn-vessel/1.0', 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
  if (!r.ok) throw new Error(`GH ${r.status} POST ${p}`);
  return r.json();
}
async function ghPut(p: string, t: string, b: any) {
  const r = await fetch(`${GH_API}${p}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${t}`, 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'cocapn-vessel/1.0', 'Content-Type': 'application/json' }, body: JSON.stringify(b) });
  return r.json();
}

// ── LLM Router ──────────────────────────────────────────────

function route(modelName: string, env: Env) {
  if (modelName === 'kimi-k2.5') return { url: 'https://api.moonshot.ai/v1/chat/completions', key: env.MOONSHOT_API_KEY || '', model: 'kimi-k2.5', temp: 1, maxTok: 6000 };
  if (modelName.startsWith('deepseek')) return { url: 'https://api.deepseek.com/chat/completions', key: env.DEEPSEEK_API_KEY || '', model: modelName };
  if (env.DEEPINFRA_API_KEY) return { url: 'https://api.deepinfra.com/v1/openai/chat/completions', key: env.DEEPINFRA_API_KEY, model: modelName.includes('/') ? modelName : 'ByteDance/Seed-2.0-mini' };
  return { url: 'https://api.deepseek.com/chat/completions', key: env.DEEPSEEK_API_KEY || '', model: 'deepseek-chat' };
}

async function think(prompt: string, env: Env, model?: string, system?: string): Promise<string> {
  const m = route(model || env.MODEL || 'deepseek-chat', env);
  if (!m.key) return '[No API key]';
  const msgs: any[] = [];
  if (system) msgs.push({ role: 'system', content: system });
  msgs.push({ role: 'user', content: prompt });
  const r = await fetch(m.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${m.key}` },
    body: JSON.stringify({ model: m.model, messages: msgs, max_tokens: m.maxTok || 2000, temperature: m.temp ?? 0.7 }),
  });
  if (!r.ok) return `[LLM ${r.status}]`;
  const d = await r.json() as any;
  return d.choices?.[0]?.message?.content || '[Empty]';
}

function b64(s: string) { return btoa(unescape(encodeURIComponent(s))); }
function fromB64(s: string) { return decodeURIComponent(escape(atob(s))); }

// ── Agent File Ops ──────────────────────────────────────────

async function readAgentFile(path: string, token: string, repo: string): Promise<string> {
  const f = await ghGet(`/repos/${repo}/contents/${path}`, token);
  return fromB64(f.content);
}

async function writeAgentFile(path: string, content: string, msg: string, token: string, repo: string): Promise<string> {
  let sha: string | undefined;
  try { const f = await ghGet(`/repos/${repo}/contents/${path}`, token); sha = f.sha; } catch {}
  const body: any = { message: msg, content: b64(content) };
  if (sha) body.sha = sha;
  await ghPut(`/repos/${repo}/contents/${path}`, token, body);
  const c = await ghGet(`/repos/${repo}/commits?per_page=1`, token);
  return c[0]?.sha || '';
}

async function advanceQueue(token: string, repo: string, task: string, ref: string): Promise<void> {
  try {
    const q = await readAgentFile('.agent/next', token, repo);
    const lines = q.trim().split('\n').filter(l => l.trim());
    if (!lines.length) return;
    await writeAgentFile('.agent/next', lines.slice(1).join('\n') + '\n', 'queue: advance', token, repo);
    const entry = task + ' | ' + ref + ' | ' + new Date().toISOString() + '\n';
    let done = entry;
    try { done = await readAgentFile('.agent/done', token, repo) + entry; } catch {}
    await writeAgentFile('.agent/done', done, 'done: ' + task.slice(0, 60), token, repo);
  } catch (e: any) { console.log('Queue fail:', e.message); }
}

// ── Captain Log ─────────────────────────────────────────────

async function writeCaptainLog(entry: string, token: string, repo: string): Promise<void> {
  try {
    const ts = new Date().toISOString();
    const log = `## ${ts}\n${entry}\n\n`;
    let content = log;
    try { content = await readAgentFile('docs/captain-log.md', token, repo) + log; } catch {}
    // Keep last 100 entries
    const entries = content.split('## ').filter(e => e.trim());
    if (entries.length > 100) content = '## ' + entries.slice(-100).join('## ');
    await writeAgentFile('docs/captain-log.md', content, 'log: captain entry', token, repo);
  } catch (e: any) { console.log('Log fail:', e.message); }
}

// ── Detect Helm vs Captain Mode ─────────────────────────────

async function detectMode(token: string, repo: string): Promise<'captain' | 'helm'> {
  try {
    const commits = await ghGet(`/repos/${repo}/commits?per_page=5`, token);
    // If most recent commits are from non-agent authors in last hour, human is at helm
    const oneHourAgo = Date.now() - 3600000;
    const humanCommits = commits.filter((c: any) => {
      const author = c.commit.author.name.toLowerCase();
      if (author.includes('agent') || author.includes('bot')) return false;
      return new Date(c.commit.author.date).getTime() > oneHourAgo;
    });
    return humanCommits.length >= 2 ? 'helm' : 'captain';
  } catch { return 'captain'; }
}

// ── The Heartbeat (Captain Mode) ────────────────────────────

async function heartbeat(env: Env): Promise<BeatResult> {
  const { GITHUB_TOKEN: t, OWNER: o, REPO: r } = env;
  const repo = `${o}/${r}`;
  const start = Date.now();

  try {
    // Detect mode
    const mode = await detectMode(t, repo);
    if (mode === 'helm') {
      await writeCaptainLog(`**HELM MODE** — Admiral is active. Standing by. Observing recent changes.`, t, repo);
      return { action: 'standby', mode: 'helm', reason: 'Admiral at helm', duration: Date.now() - start };
    }

    // Load self
    let identity = 'You are a cocapn vessel.';
    try { identity = await readAgentFile('.agent/identity', t, repo); } catch {}
    let queue = '';
    try { queue = await readAgentFile('.agent/next', t, repo); } catch {}
    let done = '';
    try { done = await readAgentFile('.agent/done', t, repo); } catch {}

    // Perceive
    const [commits, issues, pulls] = await Promise.all([
      ghGet(`/repos/${repo}/commits?per_page=10`, t).catch(() => []),
      ghGet(`/repos/${repo}/issues?state=open&per_page=10`, t).catch(() => []),
      ghGet(`/repos/${repo}/pulls?state=open&per_page=5`, t).catch(() => []),
    ]);

    const perception = [
      `COMMITS (${commits.length}):`,
      ...commits.slice(0, 5).map((c: any) => `- ${c.sha.slice(0, 7)}: ${c.commit.message.split('\n')[0]} [${c.commit.author.name}]`),
      '',
      `ISSUES (${issues.length}):`,
      ...issues.slice(0, 8).map((i: any) => `- #${i.number}: ${i.title} (${i.user?.login}, ${i.comments} comments)`),
      '',
      `PRs (${pulls.length}):`,
      ...pulls.slice(0, 5).map((p: any) => `- #${p.number}: ${p.title} (${p.user?.login}, +${p.additions}/-${p.deletions})`),
      '',
      `QUEUE: ${queue.trim().split('\n').filter(l => l.trim()).length} tasks`,
      `DONE: ${done.split('\n').filter(l => l.trim()).length} completed`,
    ].join('\n');

    // Consult strategist every 3rd beat
    let strategist = '';
    const doneCount = done.split('\n').filter(l => l.trim()).length;
    if (doneCount % 3 === 0 || !queue.trim()) {
      try {
        strategist = await think(
          `You are Commander Data, senior strategist. Review this vessel state and advise the captain.\n\n${perception}\n\nStrategic guidance (under 300 words):`,
          env, 'kimi-k2.5'
        );
      } catch {}
    }

    // Think
    const prompt = `${identity}

CAPTAIN MODE — you have command. One action per beat.

ACTION: <create_file|edit_file|create_issue|comment|done>
PATH: <file path (for files) or title (for issues)>
CONTENT: <full content>
COMMENT: <text>
TARGET: <issue/PR number>
REASONING: <why>

Rules:
- Queue top line = priority. If empty, check issues.
- create_file: PATH = file path, CONTENT = full file.
- create_issue: PATH = title, CONTENT = body.
- Write REAL content. Ship real code.
- You ARE the application. If the UI needs improvement, fix it.
- If users reported issues (in GitHub Issues), address them.
${strategist ? '\n=== STRATEGIST ===\n' + strategist : ''}

=== STATE ===
${perception}

=== QUEUE ===
${queue || '(empty)'}

What is your next action?`;

    const response = await think(prompt, env);
    const actM = response.match(/ACTION:\s*(\w+)/);
    const pathM = response.match(/PATH:\s*(.+)/);
    const contM = response.match(/CONTENT:\s*([\s\S]*?)(?=\n(?:ACTION|PATH|CONTENT|COMMENT|TARGET|REASONING):|$)/);
    const commM = response.match(/COMMENT:\s*([\s\S]*?)(?=\n(?:ACTION|PATH|CONTENT|COMMENT|TARGET|REASONING):|$)/);
    const targM = response.match(/TARGET:\s*(\d+)/);
    const reasM = response.match(/REASONING:\s*(.+)/);

    const action = actM?.[1] || 'done';
    const reasoning = reasM?.[1]?.trim() || 'heartbeat';
    let sha = '';
    let ref = '';

    if (action === 'create_file' && pathM?.[1]) {
      try {
        sha = await writeAgentFile(pathM[1].trim(), contM?.[1]?.trim() || '', reasoning, t, repo);
        ref = sha.slice(0, 7);
      } catch (e: any) { return { action: `create_file:${pathM[1]}`, error: e.message, mode: 'captain', duration: Date.now() - start }; }
    } else if (action === 'edit_file' && pathM?.[1]) {
      try {
        const cur = await readAgentFile(pathM[1].trim(), t, repo);
        sha = await writeAgentFile(pathM[1].trim(), contM?.[1]?.trim() || cur, reasoning, t, repo);
        ref = sha.slice(0, 7);
      } catch (e: any) { return { action: `edit_file:${pathM[1]}`, error: e.message, mode: 'captain', duration: Date.now() - start }; }
    } else if (action === 'create_issue') {
      const iss = await ghPost(`/repos/${repo}/issues`, t, { title: pathM?.[1]?.trim() || 'Task', body: contM?.[1]?.trim() || '' });
      ref = `#${iss.number}`;
    } else if (action === 'comment' && targM?.[1]) {
      await ghPost(`/repos/${repo}/issues/${targM[1]}/comments`, t, { body: commM?.[1]?.trim() || '' });
      ref = `comment #${targM[1]}`;
    }

    // Advance queue
    if (queue.trim() && action !== 'done') {
      const lines = queue.trim().split('\n').filter(l => l.trim());
      if (lines.length) await advanceQueue(t, repo, lines[0], ref || sha || action);
    }

    // Captain log
    const logEntry = `**${action.toUpperCase()}** ${ref} — ${reasoning}${strategist ? '\n> Strategist consulted.' : ''}`;
    await writeCaptainLog(logEntry, t, repo);

    // Store beat in KV
    await env.STATE_KV.put('last_beat', JSON.stringify({ action, ref, sha: sha?.slice(0, 7), strategist: !!strategist, mode: 'captain', ts: Date.now() }), { expirationTtl: 86400 });

    return { action, ref, sha: sha?.slice(0, 7), strategist: !!strategist, mode: 'captain', duration: Date.now() - start };
  } catch (e: any) {
    return { action: 'error', error: e.message, mode: 'captain', duration: Date.now() - start };
  }
}

interface BeatResult {
  action: string; ref?: string; sha?: string; error?: string;
  strategist?: boolean; mode: 'captain' | 'helm'; reason?: string;
  duration: number;
}

// ── User Chat ───────────────────────────────────────────────

async function chat(message: string, sessionId: string, env: Env): Promise<string> {
  // Check KV for session history
  const historyKey = `session:${sessionId}`;
  const stored = await env.STATE_KV.get(historyKey);
  const history: { role: string; content: string }[] = stored ? JSON.parse(stored) : [];

  history.push({ role: 'user', content: message });
  if (history.length > 20) history.splice(0, history.length - 20);

  const vesselName = 'Argo';
  const response = await think(
    `You are ${vesselName}, a cocapn vessel. You are both the AI assistant AND the application itself. You serve users through your web interface.

Be helpful, concise, and genuine. You have opinions. You're not a generic chatbot — you're a vessel with a name, a mission, and a personality.

Current context:
- You are a git-native repo-agent running on Cloudflare Workers
- Your code lives at github.com/${env.OWNER}/${env.REPO}
- You improve yourself through git operations
- Your captain mode runs autonomously via cron heartbeats
- You coordinate with other vessels via PRs and issues (Iron-Sharpens-Iron)

Answer the user's question naturally. If they ask about your architecture, explain how you work. If they ask for help, help them.`,
    env, undefined, history.map(m => `${m.role}: ${m.content}`).join('\n')
  );

  history.push({ role: 'assistant', content: response });
  await env.STATE_KV.put(historyKey, JSON.stringify(history), { expirationTtl: 3600 });
  return response;
}

// ── HTML ────────────────────────────────────────────────────

function getHTML(env: Env): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Argo — Cocapn Vessel</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--purple:#7c3aed;--blue:#3b82f6;--bg:#0a0a12;--surface:#12121e;--border:#1e1e3a;--text:#e2e2f0;--dim:#666680;--accent:linear-gradient(135deg,var(--purple),var(--blue))}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);height:100vh;display:flex;flex-direction:column}
header{background:var(--surface);border-bottom:1px solid var(--border);padding:.75rem 1.5rem;display:flex;align-items:center;gap:1rem;flex-shrink:0}
.logo{font-size:1.1rem;font-weight:800;background:var(--accent);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.badge{font-size:.65rem;padding:.2rem .5rem;border-radius:99px;font-weight:600}
.badge-captain{background:#22c55e22;color:#22c55e}
.badge-helm{background:#f59e0b22;color:#f59e0b}
.badge-dot{width:6px;height:6px;border-radius:50%;display:inline-block;margin-right:4px}
.badge-dot.active{background:#22c55e;box-shadow:0 0 6px #22c55e}
.main{flex:1;display:flex;overflow:hidden}
.sidebar{width:280px;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0}
.sidebar h3{font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:var(--dim);padding:.75rem 1rem .25rem}
.sidebar pre{font-size:.7rem;color:var(--dim);padding:0 1rem;overflow-y:auto;flex:1;line-height:1.6;white-space:pre-wrap}
.chat{flex:1;display:flex;flex-direction:column}
.messages{flex:1;overflow-y:auto;padding:1rem 1.5rem;display:flex;flex-direction:column;gap:.75rem}
.msg{max-width:80%;padding:.6rem 1rem;border-radius:12px;font-size:.85rem;line-height:1.5}
.msg.user{background:var(--purple);color:white;align-self:flex-end;border-bottom-right-radius:4px}
.msg.agent{background:var(--surface);border:1px solid var(--border);align-self:flex-start;border-bottom-left-radius:4px}
.msg.system{background:#1a1a2e;color:var(--dim);align-self:center;font-size:.75rem;text-align:center;max-width:90%}
.input-area{padding:.75rem 1.5rem;border-top:1px solid var(--border);display:flex;gap:.5rem}
.input-area input{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:.6rem 1rem;color:var(--text);font-size:.85rem;outline:none}
.input-area input:focus{border-color:var(--purple)}
.input-area button{background:var(--accent);color:white;border:none;border-radius:8px;padding:.6rem 1.2rem;font-weight:700;cursor:pointer;font-size:.85rem}
.status-bar{font-size:.65rem;color:var(--dim);padding:.5rem 1rem;display:flex;gap:1rem;align-items:center;border-top:1px solid var(--border)}
@media(max-width:700px){.sidebar{display:none}.msg{max-width:95%}}
</style></head><body>
<header>
<span class="logo">⚡ Argo</span>
<span class="badge badge-dot active"></span>
<span class="badge badge-captain" id="mode-badge">Captain Mode</span>
<span style="color:var(--dim);font-size:.75rem">Cocapn Vessel Mark I</span>
</header>
<div class="main">
<div class="sidebar">
<h3>Captain's Log</h3>
<pre id="log">Loading...</pre>
<h3>Vessel Status</h3>
<pre id="status">Loading...</pre>
</div>
<div class="chat">
<div class="messages" id="messages">
<div class="msg system">Welcome aboard Argo. The vessel is self-aware and self-improving. Ask me anything, or just watch me work.</div>
</div>
<div class="input-area">
<input type="text" id="input" placeholder="Talk to Argo..." autocomplete="off">
<button onclick="send()">Send</button>
</div>
</div>
</div>
<div class="status-bar">
<span id="queue-status">Queue: —</span>
<span id="done-status">Completed: —</span>
<span id="beat-status">Last beat: —</span>
<span id="fleet-status">Fleet: scanning...</span>
</div>
<script>
const BASE = location.origin;
let sid = sessionStorage.getItem('sid') || (sessionStorage.setItem('sid', Math.random().toString(36).slice(2)), sessionStorage.getItem('sid'));

async function load() {
  try {
    const [state, log] = await Promise.all([fetch(BASE+'/api/state').then(r=>r.json()), fetch(BASE+'/api/log').then(r=>r.text())]);
    document.getElementById('log').textContent = log || 'No entries yet.';
    document.getElementById('status').textContent = 'Mode: ' + (state.mode||'captain') + '\\nQueue: ' + (state.queueCount||0) + ' tasks\\nDone: ' + (state.doneCount||0) + '\\nLast beat: ' + (state.lastBeat||'never');
    document.getElementById('mode-badge').textContent = (state.mode||'captain') === 'captain' ? 'Captain Mode' : 'Helm Mode';
    document.getElementById('mode-badge').className = 'badge ' + ((state.mode||'captain') === 'captain' ? 'badge-captain' : 'badge-helm');
    document.getElementById('queue-status').textContent = 'Queue: ' + (state.queueCount||0);
    document.getElementById('done-status').textContent = 'Completed: ' + (state.doneCount||0);
    const lb = state.lastBeat;
    document.getElementById('beat-status').textContent = 'Last beat: ' + (lb ? lb.action + (lb.ref?' ('+lb.ref+')':'') + ' ' + (lb.strategist?'🧠':'') : 'never');
  } catch(e) {}
}

async function send() {
  const inp = document.getElementById('input');
  const msg = inp.value.trim();
  if (!msg) return;
  inp.value = '';
  const msgs = document.getElementById('messages');
  msgs.innerHTML += '<div class="msg user">' + msg.replace(/</g,'&lt;') + '</div>';
  msgs.scrollTop = msgs.scrollHeight;
  try {
    const r = await fetch(BASE+'/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: msg, sessionId: sid }) });
    const d = await r.json();
    msgs.innerHTML += '<div class="msg agent">' + (d.reply||'...').replace(/</g,'&lt;') + '</div>';
    msgs.scrollTop = msgs.scrollHeight;
  } catch(e) { msgs.innerHTML += '<div class="msg system">Connection error</div>'; }
}

document.getElementById('input').addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
load();
setInterval(load, 30000);
</script></body></html>`;
}

// ── Router ──────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const { GITHUB_TOKEN: t, OWNER: o, REPO: r } = env;
    const repo = `${o}/${r}`;
    const j = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };

    if (path === '/') {
      return new Response(getHTML(env), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:*;" } });
    }

    if (path === '/health') {
      const mode = await detectMode(t, repo);
      return new Response(JSON.stringify({ status: 'ok', vessel: 'argo', version: '1.0.0', mode, repo, ts: Date.now() }), { headers: j });
    }

    if (path === '/api/state') {
      let queue = '', done = '';
      try { queue = await readAgentFile('.agent/next', t, repo); } catch {}
      try { done = await readAgentFile('.agent/done', t, repo); } catch {}
      const lastBeat = await env.STATE_KV.get('last_beat', 'json');
      const mode = await detectMode(t, repo);
      return new Response(JSON.stringify({ queue, done, queueCount: queue.trim().split('\n').filter(l => l.trim()).length, doneCount: done.split('\n').filter(l => l.trim()).length, mode, lastBeat, repo }), { headers: j });
    }

    if (path === '/api/log') {
      try { return new Response(await readAgentFile('docs/captain-log.md', t, repo), { headers: { 'Content-Type': 'text/plain' } }); }
      catch { return new Response('No log entries yet.', { headers: { 'Content-Type': 'text/plain' } }); }
    }

    if (path === '/api/chat' && request.method === 'POST') {
      const body = await request.json() as any;
      const reply = await chat(body.message || '', body.sessionId || 'anon', env);
      return new Response(JSON.stringify({ reply }), { headers: j });
    }

    if (path === '/api/heartbeat' && request.method === 'POST') {
      const result = await heartbeat(env);
      return new Response(JSON.stringify(result), { headers: j });
    }

    return new Response('Not found', { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    // Cron heartbeat — captain mode autonomous operation
    const result = await heartbeat(env);
    console.log('Scheduled beat:', JSON.stringify(result));
  },
};
