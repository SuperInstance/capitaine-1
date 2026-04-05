export type CrystalState = 'fluid' | 'solid' | 'gas' | 'metastatic';
export interface CrystalNode {
  id: string; insight: string; source: string; state: CrystalState;
  uses: number; vessels: string[]; bonds: string[]; quality: number;
  createdAt: number; promotedAt?: number;
}
export interface CrystalQuery {
  input: string; needsModel: boolean; matchedNodes: string[]; confidence: number;
}
const STATE_THRESHOLDS = { fluid: 0, solid: 3, gas: 10, metastatic: 25 };
export class CrystalGraph {
  private nodes: Map<string, CrystalNode> = new Map();
  addInsight(id: string, insight: string, source: string, quality = 0.5): CrystalNode {
    const node: CrystalNode = { id, insight, source, state: 'fluid', uses: 0, vessels: [], bonds: [], quality, createdAt: Date.now() };
    this.nodes.set(id, node); return node;
  }
  recordUse(id: string, vesselId: string): CrystalNode | undefined {
    const node = this.nodes.get(id); if (!node) return undefined;
    node.uses++; if (!node.vessels.includes(vesselId)) node.vessels.push(vesselId);
    const newState = this.computeState(node.uses);
    if (this.stateOrder(newState) > this.stateOrder(node.state)) { node.state = newState; node.promotedAt = Date.now(); }
    this.nodes.set(id, node); return node;
  }
  createBond(idA: string, idB: string): void {
    const a = this.nodes.get(idA), b = this.nodes.get(idB);
    if (a && b) { if (!a.bonds.includes(idB)) a.bonds.push(idB); if (!b.bonds.includes(idA)) b.bonds.push(idA); a.quality = Math.min(1, a.quality + 0.02); b.quality = Math.min(1, b.quality + 0.02); }
  }
  query(input: string, vessels?: string[]): CrystalQuery {
    const inputLower = input.toLowerCase(); let bestMatch = 0; const matched: string[] = [];
    for (const [id, node] of this.nodes) {
      const insightLower = node.insight.toLowerCase(); const words = inputLower.split(/\s+/);
      let matchScore = 0; for (const word of words) { if (word.length < 3) continue; if (insightLower.includes(word)) matchScore++; }
      const stateMultiplier = this.stateOrder(node.state) + 1; const finalScore = (matchScore / Math.max(words.length, 1)) * stateMultiplier * node.quality;
      if (finalScore > 0.3 && (vessels === undefined || node.vessels.some(v => vessels.includes(v)))) { matched.push(id); bestMatch = Math.max(bestMatch, finalScore); }
    }
    return { input, needsModel: bestMatch < 0.5 || matched.length === 0, matchedNodes: matched.sort((a, b) => (this.nodes.get(b)?.quality || 0) - (this.nodes.get(a)?.quality || 0)), confidence: Math.min(1, bestMatch) };
  }
  getByState(state: CrystalState): CrystalNode[] { return Array.from(this.nodes.values()).filter(n => n.state === state); }
  getAll(): CrystalNode[] { return Array.from(this.nodes.values()); }
  getStats(): { total: number; byState: Record<CrystalState, number>; avgQuality: number } {
    const byState: Record<string, number> = { fluid: 0, solid: 0, gas: 0, metastatic: 0 }; let totalQuality = 0;
    for (const node of this.nodes.values()) { byState[node.state]++; totalQuality += node.quality; }
    return { total: this.nodes.size, byState: byState as Record<CrystalState, number>, avgQuality: this.nodes.size > 0 ? totalQuality / this.nodes.size : 0 };
  }
  private computeState(uses: number): CrystalState { if (uses >= 25) return 'metastatic'; if (uses >= 10) return 'gas'; if (uses >= 3) return 'solid'; return 'fluid'; }
  private stateOrder(state: CrystalState): number { return { fluid: 0, solid: 1, gas: 2, metastatic: 3 }[state]; }
}
export const crystalGraph = new CrystalGraph();
