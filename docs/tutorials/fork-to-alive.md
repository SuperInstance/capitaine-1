# Fork to Alive in 60 Seconds

## Prerequisites
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier)
- Node.js 18+

## Step 1: Fork
`https://github.com/Lucineer/capitaine` → Click "Fork"

## Step 2: Clone
```bash
git clone https://github.com/YOUR_USERNAME/capitaine.git && cd capitaine && npm install
```

## Step 3: Add Your AI Key
```bash
npx wrangler secret put DEEPSEEK_API_KEY
# Get a key: https://platform.deepseek.com/api_keys
```
Other providers: [SiliconFlow](https://cloud.siliconflow.cn) · [OpenAI](https://platform.openai.com/api-keys) · [Anthropic](https://console.anthropic.com) · [DeepInfra](https://cloud.deepinfra.com)

## Step 4: Deploy
```bash
npx wrangler deploy
```

## Step 5: Verify
```bash
curl https://capitaine.YOUR-SUBDOMAIN.workers.dev/health
```

## What You Get
- Streaming chat with any LLM (BYOK, 20 providers)
- Keeper memory (hot/warm/cold tiers)
- Crystal graph (insights crystallize over time)
- Trust engine (reliability + strategic forgiveness)
- Discovery engine (cross-vessel patterns)
- Dead reckoning (expensive→cheap pipeline)
- Cron heartbeat (every 15 min)

## Next
- [Adding Equipment](adding-equipment.md)
- [Self-Hosted Deployment](self-hosted.md)
- [Architecture Papers](../COCAPN-ARCHITECTURE.md)

*The repo IS the agent. Git IS the nervous system.*
