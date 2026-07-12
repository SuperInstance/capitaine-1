/**
 * Tests for TrustEngine — trust scoring with exponential decay.
 */

import { TrustEngine } from '../lib/trust';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}

let passed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e: any) { console.error('  ✗ ' + name + ': ' + e.message); process.exit(1); }
}

console.log('TrustEngine');

test('new entity starts at neutral trust', () => {
  const eng = new TrustEngine();
  const trust = eng.computeTrust('unknown-entity');
  assert(trust === 0.5, 'default trust should be 0.5, got ' + trust);
});

test('positive event increases trust', () => {
  const eng = new TrustEngine();
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.5, timestamp: Date.now() });
  const trust = eng.computeTrust('e1');
  assert(trust > 0.5, 'trust should increase: ' + trust);
});

test('negative event decreases trust', () => {
  const eng = new TrustEngine();
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.8, timestamp: Date.now() });
  eng.recordEvent({ entityId: 'e1', type: 'negative', magnitude: 0.5, timestamp: Date.now() });
  const trust = eng.computeTrust('e1');
  assert(trust < 0.9, 'trust should be reduced by negative event: ' + trust);
});

test('trust decays over time', () => {
  const eng = new TrustEngine();
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.9, timestamp: Date.now() });
  const trustNow = eng.computeTrust('e1');
  // 100 days later
  const trustLater = eng.computeTrust('e1', Date.now() + 100 * 24 * 60 * 60 * 1000);
  assert(trustLater < trustNow, 'trust should decay over time');
  assert(trustLater < 0.1, 'should be very low after 100 days: ' + trustLater);
});

test('getTrustLevel returns categorical label', () => {
  const eng = new TrustEngine();
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.9, timestamp: Date.now() });
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.9, timestamp: Date.now() });
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.9, timestamp: Date.now() });
  const level = eng.getTrustLevel('e1');
  assert(['high', 'medium', 'low', 'distrusted'].includes(level), 'valid level: ' + level);
});

test('resetTrust sets back to neutral', () => {
  const eng = new TrustEngine();
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.9, timestamp: Date.now() });
  eng.resetTrust('e1');
  const state = eng.getTrustState('e1');
  assert(state!.totalEvents === 0, 'events reset');
  assert(state!.currentTrust === 0.5, 'trust reset to 0.5');
});

test('setDecayRate allows custom decay', () => {
  const eng = new TrustEngine();
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.9, timestamp: Date.now() });
  eng.setDecayRate('e1', 0.5); // fast decay
  const trustLater = eng.computeTrust('e1', Date.now() + 10 * 24 * 60 * 60 * 1000);
  assert(trustLater < 0.01, 'fast decay should near-zero trust: ' + trustLater);
});

test('getAllTrustStates returns array', () => {
  const eng = new TrustEngine();
  eng.recordEvent({ entityId: 'e1', type: 'positive', magnitude: 0.5, timestamp: Date.now() });
  eng.recordEvent({ entityId: 'e2', type: 'negative', magnitude: 0.5, timestamp: Date.now() });
  const all = eng.getAllTrustStates();
  assert(all.length === 2, 'should have 2 states');
});

console.log('\n' + passed + ' tests passed ✓\n');
