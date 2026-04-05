export type DiscoveryType = 'cross_vessel' | 'equipment_gap' | 'convergence' | 'opportunity';
export interface Discovery {
  id: string; type: DiscoveryType; title: string; description: string; vessels: string[];
  evidence: string[]; confidence: number; impact: 'low' | 'medium' | 'high' | 'transformative';
  status: 'observed' | 'investigating' | 'confirmed' | 'acted_on' | 'dismissed';
  createdAt: number; updatedAt: number;
}
export interface FleetSnapshot { vesselId: string; capabilities: string[]; needs: string[]; patterns: string[]; healthScore: number; lastActive: number; }
export class DiscoveryEngine {
  private discoveries: Map<string, Discovery> = new Map();
  private snapshots: Map<string, FleetSnapshot> = new Map();
  recordSnapshot(s: FleetSnapshot) { this.snapshots.set(s.vesselId, s); }
  analyze(): Discovery[] {
    const results: Discovery[] = []; const snaps = Array.from(this.snapshots.values()); if (snaps.length < 2) return results;
    const allNeeds = new Map<string, string[]>(); const allCaps = new Map<string, string[]>();
    for (const s of snaps) { for (const n of s.needs) { if (!allNeeds.has(n)) allNeeds.set(n, []); if (!allNeeds.get(n)!.includes(s.vesselId)) allNeeds.get(n)!.push(s.vesselId); } for (const c of s.capabilities) { if (!allCaps.has(c)) allCaps.set(c, []); if (!allCaps.get(c)!.includes(s.vesselId)) allCaps.get(c)!.push(s.vesselId); } }
    for (const [need, vessels] of allNeeds) { if (vessels.length >= 2 && !allCaps.has(need)) { if (!this.hasDiscovery('equipment_gap', need)) results.push(this.recordDiscovery({ type: 'equipment_gap', title: 'Gap: ' + need, description: vessels.length + ' vessels need "' + need + '"', vessels, evidence: vessels.map(v => v + ' needs it'), confidence: Math.min(1, vessels.length * 0.2), impact: vessels.length >= 4 ? 'transformative' : 'medium' })); } }
    for (const [cap, vessels] of allCaps) { if (vessels.length >= 2 && !this.hasDiscovery('convergence', cap)) results.push(this.recordDiscovery({ type: 'convergence', title: 'Convergence: ' + cap, description: vessels.length + ' vessels implement "' + cap + '" independently', vessels, evidence: vessels.map(v => v + ' has it'), confidence: 0.6, impact: 'medium' })); }
    for (const a of snaps) for (const b of snaps) { if (a.vesselId === b.vesselId) continue; for (const cap of a.capabilities) { if (b.needs.includes(cap)) { const key = a.vesselId + '->' + b.vesselId + ':' + cap; if (!this.hasDiscovery('opportunity', key)) results.push(this.recordDiscovery({ type: 'opportunity', title: a.vesselId + ' "' + cap + '" -> ' + b.vesselId, description: a.vesselId + ' has capability ' + b.vesselId + ' needs', vessels: [a.vesselId, b.vesselId], evidence: [], confidence: 0.7, impact: 'medium' })); } } }
    return results;
  }
  recordDiscovery(partial: Omit<Discovery, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Discovery {
    const d: Discovery = { ...partial, id: 'd-' + Date.now() + '-' + Math.random().toString(36).slice(2,6), status: 'observed', createdAt: Date.now(), updatedAt: Date.now() };
    this.discoveries.set(d.id, d); return d;
  }
  updateStatus(id: string, status: Discovery['status']) { const d = this.discoveries.get(id); if (d) { d.status = status; d.updatedAt = Date.now(); } return d; }
  getByType(t: DiscoveryType) { return Array.from(this.discoveries.values()).filter(d => d.type === t); }
  getHighImpact() { return Array.from(this.discoveries.values()).filter(d => (d.impact === 'high' || d.impact === 'transformative') && d.status !== 'dismissed').sort((a, b) => b.confidence - a.confidence); }
  getAll() { return Array.from(this.discoveries.values()); }
  getStats() { const bt: Record<string,number> = {}; const bs: Record<string,number> = {}; for (const d of this.discoveries.values()) { bt[d.type] = (bt[d.type]||0)+1; bs[d.status] = (bs[d.status]||0)+1; } return { total: this.discoveries.size, byType: bt, byStatus: bs }; }
  private hasDiscovery(type: string, key: string) { for (const d of this.discoveries.values()) if (d.type === type && d.title.includes(key)) return true; return false; }
}
export const discoveryEngine = new DiscoveryEngine();
