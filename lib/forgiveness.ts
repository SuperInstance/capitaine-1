export interface Offense {
  id: string; entityId: string; type: 'crash' | 'timeout' | 'bad_output' | 'security' | 'misalignment' | 'resource_abuse';
  severity: number; timestamp: number; context: string; resolved: boolean; resolvedAt?: number;
}
export interface ForgivenessState {
  entityId: string; offenseCount: number; totalSeverity: number; currentQuarantine: boolean;
  quarantineLiftAt?: number; forgivenessScore: number; riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'; pattern?: string;
}
const SEVERITY_WEIGHTS: Record<string, number> = { crash: 0.6, timeout: 0.2, bad_output: 0.3, security: 1.0, misalignment: 0.5, resource_abuse: 0.7 };
const QUARANTINE_HOURS: Record<string, number> = { timeout: 0.1, bad_output: 1, crash: 4, misalignment: 24, resource_abuse: 48, security: 999999 };
export class ForgivenessEngine {
  private offenses: Map<string, Offense[]> = new Map();
  private states: Map<string, ForgivenessState> = new Map();
  recordOffense(offense: Offense): ForgivenessState {
    const arr = this.offenses.get(offense.entityId) || []; arr.push(offense); this.offenses.set(offense.entityId, arr);
    const state = this.computeState(offense.entityId); this.states.set(offense.entityId, state); return state;
  }
  resolve(offenseId: string, entityId: string): ForgivenessState | undefined {
    const arr = this.offenses.get(entityId) || []; const o = arr.find(x => x.id === offenseId);
    if (o) { o.resolved = true; o.resolvedAt = Date.now(); } return this.computeState(entityId);
  }
  shouldLiftQuarantine(entityId: string): { lift: boolean; reason: string } {
    const s = this.states.get(entityId); if (!s || !s.currentQuarantine) return { lift: false, reason: 'Not quarantined' };
    if (s.quarantineLiftAt && Date.now() >= s.quarantineLiftAt) return { lift: true, reason: 'Duration elapsed' };
    const recent = (this.offenses.get(entityId) || []).filter(o => !o.resolved && Date.now() - o.timestamp < 86400000);
    if (recent.length === 0) return { lift: true, reason: 'All resolved' };
    return { lift: false, reason: 'Active offenses' };
  }
  liftQuarantine(entityId: string): ForgivenessState | undefined { const s = this.states.get(entityId); if (s) { s.currentQuarantine = false; } return s; }
  computeState(entityId: string): ForgivenessState {
    const offenses = this.offenses.get(entityId) || []; const now = Date.now();
    let forgivingSeverity = 0;
    for (const o of offenses) { const ageH = (now - o.timestamp) / 3600000; const decay = Math.exp(-ageH / 168); const w = o.severity * (SEVERITY_WEIGHTS[o.type] || 0.5); forgivingSeverity += o.resolved ? w * decay * 0.3 : w * decay; }
    const recent = offenses.filter(o => !o.resolved && now - o.timestamp < 86400000);
    const maxDur = recent.reduce((m, o) => Math.max(m, QUARANTINE_HOURS[o.type] || 1), 0);
    const currentQuarantine = maxDur >= 24;
    const quarantineLiftAt = currentQuarantine ? now + maxDur * 3600000 : undefined;
    const resolvedRatio = offenses.length > 0 ? offenses.filter(o => o.resolved).length / offenses.length : 1;
    const forgivenessScore = Math.max(0, Math.min(1, 1 - forgivingSeverity * 0.3 + resolvedRatio * 0.2));
    let riskLevel: ForgivenessState['riskLevel'] = 'none';
    if (forgivingSeverity > 2) riskLevel = 'critical'; else if (forgivingSeverity > 1) riskLevel = 'high'; else if (forgivingSeverity > 0.5) riskLevel = 'medium'; else if (forgivingSeverity > 0.1) riskLevel = 'low';
    const types = offenses.map(o => o.type);
    let pattern: string | undefined;
    if (types.filter(t => t === 'crash').length >= 3) pattern = 'chronic_instability';
    else if (types.filter(t => t === 'timeout').length >= 5) pattern = 'persistent_slowdown';
    else if (types.filter(t => t === 'bad_output').length >= 4) pattern = 'quality_degradation';
    else if (types.includes('security')) pattern = 'security_concern';
    const state: ForgivenessState = { entityId, offenseCount: offenses.length, totalSeverity: Math.round(forgivingSeverity * 100) / 100, currentQuarantine, quarantineLiftAt, forgivenessScore: Math.round(forgivenessScore * 100) / 100, riskLevel, pattern };
    this.states.set(entityId, state); return state;
  }
  getAllStates(): ForgivenessState[] { return Array.from(this.states.values()); }
  getOffenses(entityId: string): Offense[] { return this.offenses.get(entityId) || []; }
}
export const forgivenessEngine = new ForgivenessEngine();
