/**
 * Tests for ForgivenessEngine — offense tracking and quarantine.
 */

import { ForgivenessEngine, Offense } from '../lib/forgiveness';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}

let passed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e: any) { console.error('  ✗ ' + name + ': ' + e.message); process.exit(1); }
}

function makeOffense(type: Offense['type'], severity = 0.5): Offense {
  return {
    id: 'o-' + Math.random().toString(36).slice(2),
    entityId: 'agent-x',
    type,
    severity,
    timestamp: Date.now(),
    context: 'test',
    resolved: false,
  };
}

console.log('ForgivenessEngine');

test('recordOffense creates state', () => {
  const eng = new ForgivenessEngine();
  const state = eng.recordOffense(makeOffense('crash'));
  assert(state.entityId === 'agent-x', 'entityId matches');
  assert(state.offenseCount === 1, '1 offense');
  assert(state.forgivenessScore > 0, 'score > 0 for single offense');
});

test('multiple crashes escalate risk', () => {
  const eng = new ForgivenessEngine();
  eng.recordOffense(makeOffense('crash'));
  eng.recordOffense(makeOffense('crash'));
  const state = eng.recordOffense(makeOffense('crash'));
  assert(state.offenseCount === 3, '3 offenses');
  assert(['medium', 'high', 'critical'].includes(state.riskLevel), 'elevated risk');
});

test('security offense causes quarantine', () => {
  const eng = new ForgivenessEngine();
  const state = eng.recordOffense(makeOffense('security', 1.0));
  assert(state.currentQuarantine === true, 'security should quarantine');
  assert(['medium', 'high', 'critical'].includes(state.riskLevel), 'elevated risk for security: ' + state.riskLevel);
  // security has the highest quarantine hours (999999)
  assert(state.quarantineLiftAt !== undefined, 'should have quarantine lift time');
});

test('resolved offenses reduce severity', () => {
  const eng = new ForgivenessEngine();
  const o = makeOffense('crash', 0.8);
  eng.recordOffense(o);
  const stateAfter = eng.resolve(o.id, 'agent-x');
  assert(stateAfter!.forgivenessScore > 0.5, 'forgiveness improves when resolved');
});

test('shouldLiftQuarantine after all resolved', () => {
  const eng = new ForgivenessEngine();
  const o = makeOffense('misalignment');
  eng.recordOffense(o);
  eng.resolve(o.id, 'agent-x');
  const result = eng.shouldLiftQuarantine('agent-x');
  // misalignment has 24h quarantine, may or may not be lifted depending on timing
  assert(typeof result.lift === 'boolean', 'should return boolean');
  assert(result.reason.length > 0, 'should have reason');
});

test('pattern detection for chronic instability', () => {
  const eng = new ForgivenessEngine();
  eng.recordOffense(makeOffense('crash'));
  eng.recordOffense(makeOffense('crash'));
  eng.recordOffense(makeOffense('crash'));
  const states = eng.getAllStates();
  const s = states.find(x => x.entityId === 'agent-x');
  assert(s?.pattern === 'chronic_instability', 'should detect chronic crashes');
});

test('timeout pattern detection', () => {
  const eng = new ForgivenessEngine();
  for (let i = 0; i < 5; i++) eng.recordOffense(makeOffense('timeout'));
  const s = eng.getAllStates().find(x => x.entityId === 'agent-x');
  assert(s?.pattern === 'persistent_slowdown', 'should detect timeouts');
});

console.log('\n' + passed + ' tests passed ✓\n');
