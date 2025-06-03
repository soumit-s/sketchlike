import { useLayerSize, useVectorEditorViewport } from "@/hooks";
import { Spline2d } from "@/lib/geometry/spline2d";
import React from "react";
import { Layer, Rect } from "react-konva";
import Spline from "../shapes/Spline";
import { IVec2 } from "@/lib/geometry";
import { usePlanObjects } from "@/hooks/use-plan-objects";
import StaticSpatialView from "./StaticSpatialView";

const DrawSplineToolView = () => {
  const { ref, width, height } = useLayerSize();
  const objects = usePlanObjects();
  const [state, setState] = React.useState<
    { mode: "normal" } | { mode: "drawing"; spline: Spline2d }
  >({ mode: "normal" });
  const [mousePos, setMousePos] = React.useState<IVec2 | undefined>(undefined);
  const { scale } = useVectorEditorViewport();

  const withAnticipatedNextPoint = React.useCallback(
    (spline: Spline2d) => {
      let newSpline = new Spline2d(spline);
      newSpline.addPoint(mousePos!);
      return newSpline;
    },
    [mousePos]
  );
  React.useEffect(() => console.log(width, height), [width, height]);

  return (
    <Layer ref={ref} scale={{ x: scale, y: scale }}>
      <Rect
        width={width ? width / scale : width}
        height={height ? height / scale: height}
        fill={"#000d"}
        onClick={(e) => {
          if (state.mode === "normal") {
            const spline = new Spline2d();
            const pos = e.target.getRelativePointerPosition()!;
            // const pos = { x: e.evt.layerX, y: e.evt.layerY };
            spline.addPoint(pos);
            // Sets initial mouse position BEFORE entering drawing mode.
            // If not done, mousePos will remain undefined in the next render.
            setMousePos(pos);
            setState({ mode: "drawing", spline });
          } else if (state.mode === "drawing") {
            const spline = new Spline2d(state.spline);
            // spline.addPoint({ x: e.evt.offsetX, y: e.evt.offsetY });
            // spline.addPoint({ x: e.evt.layerX, y: e.evt.layerY });
            spline.addPoint(e.target.getRelativePointerPosition()!);
            setState({ mode: "drawing", spline });
          }
        }}
        onMouseMove={(e) => {
          if (state.mode === "drawing") {
            // const { offsetX: x, offsetY: y } = e.evt;
            // setMousePos({ x, y });
            setMousePos(e.target.getRelativePointerPosition()!);
          }
        }}
      />
      {/** Display existing shapes with editable set to true, so that the points are visible */}
      {Array.from(objects.entries()).map(([id, object]) => (
        <StaticSpatialView key={id} object={object} />
      ))}

      {/** Currently being drawn */}
      {state.mode === "drawing" && (
        <Spline
          spline={withAnticipatedNextPoint(state.spline)}
          editable
          linehitbox={false}
          pointhitbox={(id) => !!state.spline.getPoint(id)}
          onPointClick={({ pointId, konvaEvent: e }) => {
            if (
              state.spline.edges.length > 2 &&
              state.spline.lastPoint == pointId
            ) {
              // Add the new spline to plan objects.
              const id = crypto.randomUUID();
              objects.set(id, { id, type: "spline", spline: state.spline });
              // Set the editor back to normal state.
              setState({ mode: "normal" });
            } else {
              let spline = new Spline2d(state.spline);
              const pt = spline.getPoint(pointId)!;
              spline.addPoint(pt);
              setState({ mode: "drawing", spline });
            }
          }}
          onPointDblClick={() => console.log("Double click")}
          onPointMouseOver={({ pointId }) => {
            setMousePos(state.spline.getPoint(pointId)!);
          }}
        />
      )}
    </Layer>
  );
};

export default DrawSplineToolView;
