import { Layer } from "react-konva";
import Spline, { PointDragEventHandler } from "../shapes/Spline";
import React from "react";
import { Spline2d } from "@/lib/geometry/spline2d";

export default function DummyScene() {
  const [spline, setSpline] = React.useState(() => {
    const s = new Spline2d();
    s.addPoint({ x: 100, y: 100 });
    s.addPoint({ x: 200, y: 200 });
    s.addPoint({ x: 500, y: 100 });
    return s;
  });
  const onPointDragMove: PointDragEventHandler = (e) => {
    const { offsetX: x, offsetY: y } = e.konvaEvent.evt;
    const s = new Spline2d(spline);
    s.setPoint(e.pointId, { x, y });
    setSpline(s);
  };
  return (
    <>
      <Layer>
        <Spline
          spline={spline}
          tension={0.5}
          editable
          onPointDragMove={onPointDragMove}
        />
      </Layer>
    </>
  );
}
