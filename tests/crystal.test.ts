/**
 * Tests for CrystalGraph — crystallization intelligence tracking.
 * Run: npx tsx tests/crystal.test.ts
 */

import { CrystalGraph, CrystalState } from '../lib/crystal';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}

let passed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e: any) { console.error('  ✗ ' + name + ': ' + e.message); process.exit(1); }
}

console.log('CrystalGraph');

test('addInsight creates a fluid node', () => {
  const g = new CrystalGraph();
  const n = g.addInsight('i1', 'test insight', 'vessel-a');
  assert(n.id === 'i1', 'id should match');
  assert(n.state === 'fluid', 'new insights start fluid');
  assert(n.uses === 0, 'starts with 0 uses');
  assert(n.quality === 0.5, 'default quality is 0.5');
});

test('recordUse increments uses and promotes state', () => {
  const g = new CrystalGraph();
  g.addInsight('i1', 'insight', 'src');
  g.recordUse('i1', 'v1');
  let n = g.recordUse('i1', 'v2');
  assert(n!.uses === 2, '2 uses');
  assert(n!.state === 'fluid', 'still fluid at 2');

  n = g.recordUse('i1', 'v3');
  assert(n!.uses === 3, '3 uses');
  assert(n!.state === 'solid', 'promoted to solid at 3');

  for (let i = 0; i < 7; i++) g.recordUse('i1', 'v' + i);
  n = g.recordUse('i1', 'vx');
  // 10+ uses
  assert(n!.state === 'gas', 'promoted to gas at 10+');
});

test('recordUse promotes to metastatic at 25 uses', () => {
  const g = new CrystalGraph();
  g.addInsight('i1', 'ins', 'src');
  for (let i = 0; i < 25; i++) g.recordUse('i1', 'v' + i);
  const n = g.getByState('metastatic');
  assert(n.length === 1, 'should have 1 metastatic node');
});

test('createBond links two nodes', () => {
  const g = new CrystalGraph();
  g.addInsight('a', 'insight a', 'src');
  g.addInsight('b', 'insight b', 'src');
  g.createBond('a', 'b');
  const all = g.getAll();
  const a = all.find(n => n.id === 'a')!;
  const b = all.find(n => n.id === 'b')!;
  assert(a.bonds.includes('b'), 'a should bond to b');
  assert(b.bonds.includes('a'), 'b should bond to a');
  assert(a.quality > 0.5, 'bonding increases quality');
});

test('query returns matches and confidence', () => {
  const g = new CrystalGraph();
  g.addInsight('i1', 'python runtime error', 'src');
  g.addInsight('i2', 'javascript optimization', 'src');
  const result = g.query('python error');
  assert(result.matchedNodes.includes('i1'), 'should match i1');
  assert(!result.matchedNodes.includes('i2'), 'should not match i2');
  assert(result.confidence > 0, 'confidence > 0');
});

test('query needsModel when no good match', () => {
  const g = new CrystalGraph();
  g.addInsight('i1', 'cooking recipe', 'src');
  const result = g.query('quantum physics');
  assert(result.needsModel === true, 'should need model for unrelated query');
});

test('getStats returns correct counts', () => {
  const g = new CrystalGraph();
  g.addInsight('a', 'x', 's');
  g.addInsight('b', 'y', 's');
  for (let i = 0; i < 3; i++) g.recordUse('a', 'v');
  const stats = g.getStats();
  assert(stats.total === 2, 'total should be 2');
  assert(stats.byState.fluid === 1, '1 fluid');
  assert(stats.byState.solid === 1, '1 solid');
});

console.log('\n' + passed + ' tests passed ✓\n');
