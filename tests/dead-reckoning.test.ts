/**
 * Tests for DeadReckoningEngine — pipeline for storyboard→animation→review→publish.
 */

import { DeadReckoningEngine } from '../lib/dead-reckoning';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}

let passed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e: any) { console.error('  ✗ ' + name + ': ' + e.message); process.exit(1); }
}

console.log('DeadReckoningEngine');

test('addToCompass creates a planned item', () => {
  const eng = new DeadReckoningEngine();
  const item = eng.addToCompass({
    title: 'Test idea',
    description: 'A test',
    horizon: '1yr',
    tier: 'cheap',
    dependencies: [],
    vesselId: 'v1',
  });
  assert(item.status === 'planned', 'starts as planned');
  assert(item.id.startsWith('c-'), 'id starts with c-');
});

test('processPipeline advances items through stages', () => {
  const eng = new DeadReckoningEngine();
  eng.addToCompass({ title: 'A', description: 'd', horizon: '1yr', tier: 'mid', dependencies: [] });
  let r = eng.processPipeline();
  assert(r.storyboards === 1, '1 storyboarded');
  r = eng.processPipeline();
  assert(r.animations === 1, '1 animated');
  r = eng.processPipeline();
  assert(r.processed === 1, '1 reviewed');
  r = eng.processPipeline();
  assert(r.published === 1, '1 published');
});

test('dependencies block progression', () => {
  const eng = new DeadReckoningEngine();
  const dep = eng.addToCompass({ title: 'dep', description: 'd', horizon: '1yr', tier: 'mid', dependencies: [] });
  eng.addToCompass({ title: 'child', description: 'd', horizon: '1yr', tier: 'mid', dependencies: [dep.id] });
  // Advance dep to reviewed, child should still be blocked until dep is published
  eng.processPipeline(); // dep: planned→storyboarded, child blocked
  const items = eng.getAll();
  const child = items.find(i => i.title === 'child')!;
  assert(child.status === 'planned', 'child should be blocked while dep not published');
});

test('estimateCost returns cost projection', () => {
  const eng = new DeadReckoningEngine();
  eng.addToCompass({ title: 'A', description: 'd', horizon: '1yr', tier: 'expensive', dependencies: [] });
  eng.addToCompass({ title: 'B', description: 'd', horizon: '5yr', tier: 'cheap', dependencies: [] });
  const cost = eng.estimateCost();
  assert(cost.total > 0, 'total cost > 0');
  assert(cost.byTier.expensive > 0, 'has expensive component');
});

test('getByStatus filters correctly', () => {
  const eng = new DeadReckoningEngine();
  eng.addToCompass({ title: 'A', description: 'd', horizon: '1yr', tier: 'mid', dependencies: [] });
  eng.processPipeline();
  const storyboarded = eng.getByStatus('storyboarded');
  assert(storyboarded.length === 1, '1 storyboarded');
  const planned = eng.getByStatus('planned');
  assert(planned.length === 0, '0 planned');
});

test('getStats returns summary', () => {
  const eng = new DeadReckoningEngine();
  eng.addToCompass({ title: 'A', description: 'd', horizon: '1yr', tier: 'mid', dependencies: [] });
  eng.addToCompass({ title: 'B', description: 'd', horizon: '5yr', tier: 'cheap', dependencies: [] });
  const stats = eng.getStats();
  assert(stats.total === 2, 'total 2');
  assert(typeof stats.cost.total === 'number', 'has cost');
});

console.log('\n' + passed + ' tests passed ✓\n');
