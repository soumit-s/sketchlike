import { IVec2 } from ".";

export class Polygon {
  private points: Map<number, IVec2>;
  private edges: Map<number, IVec2>;
  
  constructor(p?: Polygon) {
    this.points = new Map(p?.points);
    this.edges = new Map(p?.edges);
  }
}