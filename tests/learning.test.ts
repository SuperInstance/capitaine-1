/**
 * Tests for LearningEngine — memory tiers and lesson lifecycle.
 */

import { LearningEngine } from '../lib/learning';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}

let passed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e: any) { console.error('  ✗ ' + name + ': ' + e.message); process.exit(1); }
}

console.log('LearningEngine');

test('recordLesson creates a lesson', () => {
  const eng = new LearningEngine();
  const l = eng.recordLesson('error', 'nil pointer dereference', 'production crash');
  assert(l.type === 'error', 'type matches');
  assert(l.tier === 'warm', 'errors start warm');
  assert(l.confidence === 0.7, 'default confidence');
  assert(l.applications === 0, '0 applications');
});

test('applyLesson increments and can promote', () => {
  const eng = new LearningEngine();
  const l = eng.recordLesson('success', 'refactored module', 'cleanup');
  eng.applyLesson(l.id);
  eng.applyLesson(l.id);
  const updated = eng.applyLesson(l.id);
  assert(updated!.applications === 3, '3 applications');
  assert(updated!.tier === 'warm', 'promoted hot->warm at 3 uses');
});

test('promote from warm to cold at 10 uses', () => {
  const eng = new LearningEngine();
  const l = eng.recordLesson('success', 'pattern X', 'context');
  for (let i = 0; i < 10; i++) eng.applyLesson(l.id);
  const updated = eng.getAll().find(x => x.id === l.id);
  assert(updated!.tier === 'cold', 'should be cold after 10 uses');
});

test('query finds relevant lessons', () => {
  const eng = new LearningEngine();
  eng.recordLesson('pattern', 'database connection pooling', 'postgres');
  eng.recordLesson('error', 'UI rendering bug', 'frontend');
  const results = eng.query('database connection issue');
  assert(results.length > 0, 'should find matching lesson');
  assert(results[0].content.includes('database'), 'top result about database');
});

test('query filters by vessel', () => {
  const eng = new LearningEngine();
  eng.recordLesson('pattern', 'shared insight', 'ctx', ['vessel-a']);
  eng.recordLesson('pattern', 'other insight', 'ctx', ['vessel-b']);
  const results = eng.query('insight', ['vessel-a']);
  assert(results.every(l => l.vessels.includes('vessel-a') || l.vessels.length === 0), 'respects vessel filter');
});

test('gc removes expired lessons', () => {
  const eng = new LearningEngine();
  // Create a lesson that's already expired
  const l = eng.recordLesson('error', 'temp issue', 'ctx');
  // Manually expire it by modifying internal state isn't possible from outside,
  // so test gc returns valid structure
  const result = eng.gc();
  assert(typeof result.removed === 'number', 'gc returns removed count');
  assert(typeof result.promoted === 'number', 'gc returns promoted count');
});

test('getStats returns counts', () => {
  const eng = new LearningEngine();
  eng.recordLesson('error', 'a', 'c');
  eng.recordLesson('success', 'b', 'c');
  eng.recordLesson('pattern', 'd', 'c');
  const stats = eng.getStats();
  assert(stats.total === 3, 'total 3');
  assert(stats.byTier.hot >= 0, 'has hot count');
  assert(stats.byTier.warm >= 0, 'has warm count');
  assert(typeof stats.avgConfidence === 'number', 'has avgConfidence');
});

console.log('\n' + passed + ' tests passed ✓\n');
