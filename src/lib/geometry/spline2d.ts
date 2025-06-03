import { IVec2 } from ".";

export type PointID = number;

export class Spline2d {
  private _points: Map<PointID, IVec2>;
  private _edges: PointID[];
  private pointIdSeq: number;
  public tension: number;

  constructor(spline?: Spline2d) {
    this._points = new Map(spline?._points);
    this._edges = spline ? [...spline._edges] : [];
    this.pointIdSeq = spline?.pointIdSeq ?? 1;
    this.tension = spline?.tension ?? 0.3;
  }

  getPoint(id: PointID) {
    return this._points.get(id);
  }

  setPoint(id: PointID, point: IVec2) {
    this._points.set(id, point);
  }

  addPoint(point: IVec2, duplicate: boolean = false): PointID {
    if (!duplicate) {
      for (const [key, value] of Array.from(this._points.entries())) {
        if (value.x === point.x && value.y === point.y) {
          this._edges.push(key);
          return key;
        }
      }
    }
    this._points.set(this.pointIdSeq++, point);
    const key = this.pointIdSeq - 1;
    this._edges.push(key);
    return key;
  }

  get points() {
    return this._points.entries();
  }

  get edges() {
    return this._edges.map((p) => this.getPoint(p)!);
  }

  get lastPoint() {
    return this._edges[this._edges.length - 1];
  }
}
