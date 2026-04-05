export type MemoryTier = 'hot' | 'warm' | 'cold';
export type LessonType = 'error' | 'success' | 'pattern' | 'preference' | 'constraint';
export interface Lesson {
  id: string; type: LessonType; content: string; context: string; tier: MemoryTier;
  vessels: string[]; confidence: number; applications: number; lastApplied?: number;
  createdAt: number; expiresAt?: number; promotedAt?: number;
}
const TIER_MAX_AGE: Record<MemoryTier, number> = { hot: 3600000, warm: 604800000, cold: Infinity };
export class LearningEngine {
  private lessons: Map<string, Lesson> = new Map();
  recordLesson(type: LessonType, content: string, context: string, vessels: string[] = [], confidence = 0.7): Lesson {
    const id = 'l-' + Date.now() + '-' + Math.random().toString(36).slice(2,6);
    const tier: MemoryTier = type === 'error' || type === 'constraint' ? 'warm' : 'hot';
    const lesson: Lesson = { id, type, content, context, tier, vessels, confidence, applications: 0, createdAt: Date.now(), expiresAt: Date.now() + TIER_MAX_AGE[tier] };
    this.lessons.set(id, lesson); return lesson;
  }
  applyLesson(id: string): Lesson | undefined {
    const l = this.lessons.get(id); if (!l) return undefined;
    l.applications++; l.lastApplied = Date.now();
    if (l.tier === 'hot' && l.applications >= 3) this.promote(id, 'warm');
    else if (l.tier === 'warm' && l.applications >= 10) this.promote(id, 'cold');
    return l;
  }
  promote(id: string, newTier: MemoryTier): Lesson | undefined {
    const l = this.lessons.get(id); if (!l) return undefined;
    const order: Record<MemoryTier, number> = { hot: 0, warm: 1, cold: 2 };
    if (order[newTier] <= order[l.tier]) return l;
    l.tier = newTier; l.promotedAt = Date.now(); l.expiresAt = newTier === 'cold' ? undefined : Date.now() + TIER_MAX_AGE[newTier];
    l.confidence = Math.min(1, l.confidence + 0.1); return l;
  }
  query(context: string, vessels?: string[]): Lesson[] {
    const now = Date.now(); const ctxLow = context.toLowerCase(); const results: Lesson[] = [];
    for (const l of this.lessons.values()) {
      if (l.expiresAt && now > l.expiresAt) continue;
      if (vessels && l.vessels.length > 0 && !l.vessels.some(v => vessels.includes(v))) continue;
      const words = ctxLow.split(/\s+/).filter(w => w.length > 3);
      let matches = 0; const cLow = l.content.toLowerCase();
      for (const w of words) { if (cLow.includes(w) || l.context.toLowerCase().includes(w)) matches++; }
      if (words.length > 0 && matches / words.length > 0.2) results.push(l);
    }
    const tierO: Record<MemoryTier, number> = { hot: 0, warm: 1, cold: 2 };
    results.sort((a, b) => { const td = tierO[b.tier] - tierO[a.tier]; if (td) return td; return (b.lastApplied||b.createdAt) - (a.lastApplied||a.createdAt); });
    return results;
  }
  gc(): { removed: number; promoted: number } {
    const now = Date.now(); let removed = 0, promoted = 0;
    for (const [id, l] of this.lessons) {
      if (l.expiresAt && now > l.expiresAt) { if (l.applications >= 5 && l.tier !== 'cold') { this.promote(id, l.tier === 'hot' ? 'warm' : 'cold'); promoted++; } else { this.lessons.delete(id); removed++; } }
    }
    return { removed, promoted };
  }
  getByTier(tier: MemoryTier) { return Array.from(this.lessons.values()).filter(l => l.tier === tier); }
  getAll() { return Array.from(this.lessons.values()); }
  getStats() { const bt: Record<MemoryTier,number> = { hot:0, warm:0, cold:0 }; const byType: Record<string,number> = {}; let tc = 0;
    for (const l of this.lessons.values()) { bt[l.tier]++; byType[l.type] = (byType[l.type]||0)+1; tc += l.confidence; }
    return { total: this.lessons.size, byTier: bt, byType, avgConfidence: this.lessons.size > 0 ? tc / this.lessons.size : 0 };
  }
}
export const learningEngine = new LearningEngine();
