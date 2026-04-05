export type ModelTier = 'expensive' | 'mid' | 'cheap';
export interface CompassItem {
  id: string; title: string; description: string; horizon: '1yr' | '5yr' | '10yr' | '25yr' | '100yr';
  tier: ModelTier; status: 'planned' | 'storyboarded' | 'animated' | 'reviewed' | 'published';
  storyboard: string; animation: string; reviewNotes?: string; vesselId?: string; dependencies: string[];
  createdAt: number; updatedAt: number;
}
export interface PipelineResult { processed: number; storyboards: number; animations: number; published: number; errors: string[]; }
const HORIZON_W: Record<string, number> = { '1yr': 1, '5yr': 2, '10yr': 3, '25yr': 5, '100yr': 10 };
export class DeadReckoningEngine {
  private compass: Map<string, CompassItem> = new Map();
  addToCompass(partial: Omit<CompassItem, 'id' | 'status' | 'storyboard' | 'animation' | 'createdAt' | 'updatedAt'>): CompassItem {
    const item: CompassItem = { ...partial, id: 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2,6), status: 'planned', storyboard: '', animation: '', createdAt: Date.now(), updatedAt: Date.now() };
    this.compass.set(item.id, item); return item;
  }
  processPipeline(): PipelineResult {
    const r: PipelineResult = { processed: 0, storyboards: 0, animations: 0, published: 0, errors: [] };
    for (const item of this.compass.values()) {
      const depsMet = item.dependencies.every(d => { const dep = this.compass.get(d); return dep && (dep.status === 'reviewed' || dep.status === 'published'); });
      if (!depsMet && item.dependencies.length > 0) continue;
      if (item.status === 'planned') { item.status = 'storyboarded'; item.updatedAt = Date.now(); r.storyboards++; r.processed++; }
      else if (item.status === 'storyboarded') { item.status = 'animated'; item.updatedAt = Date.now(); r.animations++; r.processed++; }
      else if (item.status === 'animated') { item.status = 'reviewed'; item.updatedAt = Date.now(); r.processed++; }
      else if (item.status === 'reviewed') { item.status = 'published'; item.updatedAt = Date.now(); r.published++; }
    }
    return r;
  }
  setStoryboard(id: string, s: string) { const i = this.compass.get(id); if (i) { i.storyboard = s; i.status = 'storyboarded'; i.updatedAt = Date.now(); } return i; }
  setAnimation(id: string, a: string) { const i = this.compass.get(id); if (i) { i.animation = a; i.status = 'animated'; i.updatedAt = Date.now(); } return i; }
  addReview(id: string, notes: string) { const i = this.compass.get(id); if (i) { i.reviewNotes = notes; i.status = 'reviewed'; i.updatedAt = Date.now(); } return i; }
  estimateCost() { let exp = 0, mid = 0, cheap = 0; for (const i of this.compass.values()) { const w = HORIZON_W[i.horizon]; if (i.status === 'planned') exp += 5 * w; if (i.status === 'storyboarded') mid += 0.5 * w; if (i.status === 'animated') cheap += 0.05 * w; } return { byTier: { expensive: exp, mid, cheap }, total: exp + mid + cheap }; }
  getByStatus(s: CompassItem['status']) { return Array.from(this.compass.values()).filter(i => i.status === s); }
  getAll() { return Array.from(this.compass.values()); }
  getStats() { const bs: Record<string,number> = {}; const bh: Record<string,number> = {}; for (const i of this.compass.values()) { bs[i.status] = (bs[i.status]||0)+1; bh[i.horizon] = (bh[i.horizon]||0)+1; } return { total: this.compass.size, byStatus: bs, byHorizon: bh, cost: this.estimateCost() }; }
}
export const deadReckoning = new DeadReckoningEngine();
