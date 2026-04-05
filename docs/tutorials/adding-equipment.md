# Adding Equipment

Equipment is how vessels gain capabilities without growing complex. Mech armor — snap on, snap off.

## The Library
[cocapn-equipment](https://github.com/Lucineer/cocapn-equipment) — 20 modules:

| Module | Purpose |
|--------|---------|
| `crystal-graph` | Insights crystallize: fluid→solid→gas→metastatic |
| `forgiveness-engine` | Quarantine, pattern detection, time-decay |
| `dead-reckoning` | Expensive models storyboard, cheap animate |
| `learning-engine` | Hot/warm/cold memory tiers |
| `discovery-engine` | Cross-vessel equipment gaps + convergence |
| `trust-engine` | Reliability tracking, risk levels |
| `byok-v2` | 20-provider key management |
| `confidence-tracker` | Response confidence scoring |
| `deadband` | Response caching with staleness detection |

## How to Wire Equipment

```typescript
import { crystalGraph } from './lib/crystal.ts';

// Before LLM call — check cache
const query = crystalGraph.query(userMessage);
if (!query.needsModel) return cachedInsight;

// After response — record new insight
crystalGraph.addInsight('id', 'User prefers concise answers', 'chat', 0.7);

// Track usage → state transitions (3→solid, 10→gas, 25→metastatic)
crystalGraph.recordUse('id', 'my-vessel');
```

## Creating New Equipment

```typescript
export class MyEquipment {
  private state: Map<string, any> = new Map();
  process(input: string, config: any): any { /* focused logic */ }
  getStats() { /* report state */ }
}
export const myEquipment = new MyEquipment();
```

Principles: one responsibility, Map-based state, stats method, singleton export, zero deps.

## Equipment vs Skills
| | Equipment | Skills |
|---|---|---|
| Where | Code module | Prompt/context |
| Effect | WHAT agent perceives | HOW agent thinks |
| Change | Update module | Update system prompt |
| Example | Crystal graph | "Teach-don't-tell" persona |

*Don't build agents bigger. Equip them.*
