import { Rect } from "@/lib/geometry";
import { KonvaEventObject } from "konva/lib/Node";
import React, { Fragment } from "react";
import { Circle, Group, Rect as KonvaRect, Line } from "react-konva";

interface IRectangleProps {
  rect: Rect;
  controlPoints?: boolean;
  controlPointsHitbox?: boolean;
  lineHitbox?: boolean;
  onClick?: (e: KonvaEventObject<MouseEvent>) => any;
}

const Rectangle = ({
  rect,
  controlPoints = false,
  controlPointsHitbox = true,
  lineHitbox = true,
  onClick,
}: IRectangleProps) => {
  const r = 5;
  const cpoints = React.useMemo(
    () => [
      { pos: [rect.x, rect.y] } /** Top Left */,
      { pos: [rect.x + rect.width, rect.y] } /** Top Right */,
      { pos: [rect.x + rect.width, rect.y + rect.height] } /** Bottom Right */,
      { pos: [rect.x, rect.y + rect.height] } /** Bottom Left */,
    ],
    [rect.x, rect.y, rect.width, rect.height]
  );
  const edges = React.useMemo(
    () => [
      [cpoints[0], cpoints[1]],
      [cpoints[1], cpoints[2]],
      [cpoints[2], cpoints[3]],
      [cpoints[3], cpoints[0]],
    ],
    [cpoints]
  );
  return (
    <Group>
      {/* <KonvaRect
        {...rect}
        stroke={"black"}
        onClick={onClick}
        hitStrokeWidth={5}
        listening={lineHitbox}
      /> */}
      {edges.map(([a, b], idx) => {
        // Get the length of edge
        const length = Math.sqrt(
          Math.pow(a.pos[0] - b.pos[0], 2) + Math.pow(a.pos[1] - b.pos[1], 2)
        );
        // Get the unit vector
        const n = [
          (a.pos[0] - b.pos[0]) / length,
          (a.pos[1] - b.pos[1]) / length,
        ];
        let i = Math.min(0.2, length * 0.1);
        i = Math.random() * i + i;
        const p1 = [
          n[0] * (length + i) + b.pos[0],
          n[1] * (length + i) + b.pos[1],
        ];
        const p2 = [
          -n[0] * (length + i) + a.pos[0],
          -n[1] * (length + i) + a.pos[1],
        ];
        // Get the gradient
        const g = (p1[1] - p2[1]) / (p1[0] - p2[0])
        const normal = -1 / g;
        const center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        const m = Math.sqrt(1 + normal * normal)
        const pc = [2 * 1 / m + center[0], 2 *  (Math.abs(m) === Infinity ? Math.sign(m) : normal / m) + center[1]]
        return (
          <Fragment key={idx}>
              <Line
              points={[p1, p2].flat()}
              lineCap="round"
              lineJoin="round"
              stroke={"black"}
              strokeWidth={2}
              onClick={onClick}
              hitStrokeWidth={5}
              listening={lineHitbox}
            />
            <Line
              points={[p1, pc, p2].flat()}
              lineCap="round"
              lineJoin="round"
              tension={0.1}
              stroke={"black"}
              strokeWidth={2}
              onClick={onClick}
              hitStrokeWidth={5}
              listening={lineHitbox}
            />
          </Fragment>
        );
      })}
      {controlPoints && (
        <Group>
          {cpoints.map(({ pos: [x, y] }) => (
            <Circle
              x={x}
              y={y}
              radius={r}
              fill="black"
              listening={controlPointsHitbox}
            />
          ))}
        </Group>
      )}
    </Group>
  );
};

export default Rectangle;
