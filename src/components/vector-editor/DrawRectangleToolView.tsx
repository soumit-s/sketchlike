import { usePlanObjects } from "@/hooks/use-plan-objects";
import React from "react";
import { Group, Layer, Rect } from "react-konva";
import StaticSpatialView from "./StaticSpatialView";
import { Rect as ShapeRect } from "@/lib/geometry";
import Rectangle from "../shapes/Rectangle";
import { useLayerSize, useVectorEditorViewport } from "@/hooks";

const DrawRectangleToolView = () => {
  const { ref, width, height } = useLayerSize();
  const objects = usePlanObjects();
  const [state, setState] = React.useState<
    { mode: "normal" } | { mode: "drawing"; rect: ShapeRect }
  >({ mode: "normal" });
  const { scale } = useVectorEditorViewport();

  return (
    <Layer ref={ref} scale={{ x: scale, y: scale }}>
      <Rect
        width={width ? width / scale : width}
        height={height ? height / scale : height}
        onClick={(e) => {
          if (e.evt.button !== 0) return;
          console.log("Drawing");
          if (state.mode === "normal") {
            // Start drawing
            const mpos = e.currentTarget.getRelativePointerPosition()!;
            const rect = new ShapeRect(mpos.x, mpos.y, 0, 0);
            setState({ mode: "drawing", rect });
          } else if (state.mode === "drawing") {
            // Finalise drawing
            const id = crypto.randomUUID();
            objects.set(id, { id, type: "rect", rect: state.rect });
            setState({ mode: "normal" });
          }
        }}
        onMouseMove={(e) => {
          if (state.mode === "drawing") {
            // const { offsetX: x, offsetY: y } = e.evt;
            const { x, y } = e.target.getRelativePointerPosition()!;
            const rect = new ShapeRect(
              state.rect.x,
              state.rect.y,
              x - state.rect.x,
              y - state.rect.y
            );
            setState({ mode: "drawing", rect });
          }
        }}
      />

      <Group>
        {/* Draw the existing shapes */}
        {Array.from(objects.entries()).map(([id, object]) => (
          <StaticSpatialView key={id} object={object} />
        ))}
        {state.mode === "drawing" && (
          <Rectangle
            rect={state.rect}
            lineHitbox={false}
            controlPoints={true}
            controlPointsHitbox={false}
          />
        )}
      </Group>
    </Layer>
  );
};

export default DrawRectangleToolView;
