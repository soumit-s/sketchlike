import { useSet } from "@mantine/hooks";
import Spline from "../shapes/Spline";
import { Spline2d } from "@/lib/geometry/spline2d";
import { Fragment } from "react/jsx-runtime";
import { Layer, Rect } from "react-konva";
import { usePlanObjects } from "@/hooks/use-plan-objects";
import Rectangle from "../shapes/Rectangle";
import { useLayerSize } from "@/hooks";

/** Returns whats in the viewport when the tool is a selection tool */
const SelectionToolView = () => {
  const { ref, width, height } = useLayerSize();
  // Lets create two splines for testing purposes.
  // Get all the vector shapes in this view.
  // const splines = useMap<string, Spline2d>([["a", createSpline()]]);
  const objects = usePlanObjects();
  const selections = useSet<string>();
  return (
    <Layer ref={ref}>
      <Rect width={width} height={height} onClick={() => selections.clear()} />

      {/* The objects */}
      {Array.from(objects.entries()).map(([id, object]) => {
        const selected = selections.has(id);
        const onSelect = (e) => {
          if (e.evt.shiftKey) {
            if (selected) {
              selections.delete(id); // Only deselect this spline.
            } else {
              selections.add(id); // Append selection
            }
          } else {
            selections.clear(); // Clears all other selections
            selections.add(id); // Adds spline to selection.
          }
        };

        /** Splines */
        if (object.type === "spline") {
          const { spline } = object;
          return (
            <Fragment key={id}>
              <Spline
                spline={spline}
                editable={selected}
                onClick={onSelect}
                onPointDragMove={({ pointId, konvaEvent }) => {
                  const { movementX, movementY } = konvaEvent.evt;
                  const point = spline.getPoint(pointId)!;
                  let s = new Spline2d(spline);
                  s.setPoint(pointId, {
                    x: point.x + movementX,
                    y: point.y + movementY,
                  });
                  objects.set(id, { id, type: "spline", spline: s });
                }}
              />
            </Fragment>
          );
        }

        /** Rectangles */
        if (object.type === "rect") {
          const { rect } = object;
          return (
            <Fragment key={id}>
              <Rectangle
                rect={rect}
                lineHitbox={true}
                onClick={onSelect}
                controlPoints={selected}
                controlPointsHitbox={selected}
              />
            </Fragment>
          );
        }
      })}
    </Layer>
  );
};

export default SelectionToolView;
