# Self-Hosted Deployment

## Supported Runtimes
Pure TypeScript, zero deps. Runs on Cloudflare Workers, Deno Deploy, Node.js, Bun, Docker.

## Deno Deploy
```bash
deno deploy --project=my-capitaine src/worker.ts
```

## Node.js / Express
```typescript
import express from 'express';
app.all('*', async (req, res) => {
  const response = await handler(new Request(`http://localhost${req.url}`, { method: req.method, body: JSON.stringify(req.body) }), envVars);
  res.status(response.status).send(await response.text());
});
app.listen(3000);
```

## Docker
```dockerfile
FROM node:20-alpine
COPY . . && npm ci --production
EXPOSE 3000
CMD ["node", "server.ts"]
```

## Memory Layer
Swap `KVNamespace` for SQLite, Redis, LokiJS, or in-memory Map. Interface: `get(key)`, `put(key, value, opts?)`, `delete(key)`, `list({prefix?})`.

## Cron (non-Workers)
```bash
*/15 * * * * curl -s http://localhost:3000/api/heartbeat -X POST
```

## Custom Domain
Workers: `npx wrangler domains add my-agent.example.com`
Other: DNS → nginx/Caddy reverse proxy with TLS.

*Deploy anywhere. The vessel is the hardware.*
