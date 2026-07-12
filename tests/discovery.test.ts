/**
 * Tests for DiscoveryEngine — fleet-wide pattern detection.
 */

import { DiscoveryEngine } from '../lib/discovery';

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg);
}

let passed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e: any) { console.error('  ✗ ' + name + ': ' + e.message); process.exit(1); }
}

console.log('DiscoveryEngine');

test('recordSnapshot stores fleet data', () => {
  const eng = new DiscoveryEngine();
  eng.recordSnapshot({ vesselId: 'v1', capabilities: ['search'], needs: ['auth'], patterns: [], healthScore: 0.9, lastActive: Date.now() });
  // No crash = pass
});

test('analyze detects equipment gaps', () => {
  const eng = new DiscoveryEngine();
  eng.recordSnapshot({ vesselId: 'v1', capabilities: ['search'], needs: ['logging'], patterns: [], healthScore: 0.8, lastActive: Date.now() });
  eng.recordSnapshot({ vesselId: 'v2', capabilities: ['auth'], needs: ['logging'], patterns: [], healthScore: 0.7, lastActive: Date.now() });
  const discoveries = eng.analyze();
  const gaps = discoveries.filter(d => d.type === 'equipment_gap');
  assert(gaps.length > 0, 'should detect logging gap across v1 and v2');
});

test('analyze detects convergence', () => {
  const eng = new DiscoveryEngine();
  eng.recordSnapshot({ vesselId: 'v1', capabilities: ['search'], needs: [], patterns: [], healthScore: 0.9, lastActive: Date.now() });
  eng.recordSnapshot({ vesselId: 'v2', capabilities: ['search'], needs: [], patterns: [], healthScore: 0.9, lastActive: Date.now() });
  const discoveries = eng.analyze();
  const convergences = discoveries.filter(d => d.type === 'convergence');
  assert(convergences.length > 0, 'should detect search convergence');
});

test('analyze detects cross-vessel opportunities', () => {
  const eng = new DiscoveryEngine();
  eng.recordSnapshot({ vesselId: 'v1', capabilities: ['auth'], needs: ['search'], patterns: [], healthScore: 0.9, lastActive: Date.now() });
  eng.recordSnapshot({ vesselId: 'v2', capabilities: ['search'], needs: ['auth'], patterns: [], healthScore: 0.9, lastActive: Date.now() });
  const discoveries = eng.analyze();
  const ops = discoveries.filter(d => d.type === 'opportunity');
  assert(ops.length > 0, 'should detect mutual opportunity');
});

test('analyze returns empty with < 2 snapshots', () => {
  const eng = new DiscoveryEngine();
  eng.recordSnapshot({ vesselId: 'v1', capabilities: [], needs: [], patterns: [], healthScore: 1.0, lastActive: Date.now() });
  const results = eng.analyze();
  assert(results.length === 0, 'should need 2+ snapshots');
});

test('updateStatus changes discovery status', () => {
  const eng = new DiscoveryEngine();
  const d = eng.recordDiscovery({
    type: 'convergence', title: 'test', description: 'd', vessels: ['v1'],
    evidence: [], confidence: 0.5, impact: 'medium',
  });
  eng.updateStatus(d.id, 'confirmed');
  assert(d.status === 'confirmed', 'should be confirmed');
});

test('getHighImpact filters and sorts', () => {
  const eng = new DiscoveryEngine();
  eng.recordDiscovery({ type: 'opportunity', title: 'low', description: 'd', vessels: [], evidence: [], confidence: 0.3, impact: 'low' });
  eng.recordDiscovery({ type: 'opportunity', title: 'high', description: 'd', vessels: [], evidence: [], confidence: 0.9, impact: 'transformative' });
  const hi = eng.getHighImpact();
  assert(hi.length === 1, 'only high impact');
  assert(hi[0].title === 'high', 'should be the transformative one');
});

test('getStats returns counts', () => {
  const eng = new DiscoveryEngine();
  eng.recordDiscovery({ type: 'opportunity', title: 'a', description: 'd', vessels: [], evidence: [], confidence: 0.5, impact: 'low' });
  eng.recordDiscovery({ type: 'convergence', title: 'b', description: 'd', vessels: [], evidence: [], confidence: 0.5, impact: 'low' });
  const stats = eng.getStats();
  assert(stats.total === 2, 'total 2');
  assert(typeof stats.byType === 'object', 'has byType');
});

console.log('\n' + passed + ' tests passed ✓\n');
