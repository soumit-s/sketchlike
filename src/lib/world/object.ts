import { Rect, Spline2d } from "@/lib/geometry";

type OTRect = { type: "rect"; rect: Rect };
type OTSpline = { type: "spline"; spline: Spline2d };
type OTStructure = { type: "structure" };

export type Spatial = { id: string } & (OTRect | OTSpline | OTStructure);
