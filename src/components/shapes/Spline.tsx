import { PointID, Spline2d } from "@/lib/geometry/spline2d";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle, Line, Shape } from "react-konva";
import { Fragment } from "react/jsx-runtime";
import { drawBSpline } from "@/lib/geometry/bspline";

export type PointDragEventHandler = (e: {
  pointId: PointID;
  konvaEvent: KonvaEventObject<DragEvent>;
}) => any;

export type PointMouseEventHandler = (e: {
  pointId: PointID;
  konvaEvent: KonvaEventObject<MouseEvent>;
}) => any;

interface ISplineProps {
  spline: Spline2d;
  editable?: boolean;
  tension?: number;

  linehitbox?: boolean;
  pointhitbox?: boolean | ((pointId: PointID) => boolean);

  onClick?: (e: KonvaEventObject<MouseEvent>) => any;
  onPointClick?: PointMouseEventHandler;
  onPointDblClick?: PointMouseEventHandler;
  onPointMouseOver?: PointMouseEventHandler;
  onPointDragMove?: PointDragEventHandler;
  onPointDragStart?: PointDragEventHandler;
  onPointDragEnd?: PointDragEventHandler;
}

const Spline = ({
  spline,
  editable = false,
  tension,

  linehitbox = true,
  pointhitbox = true,

  // Event Handlers
  onClick,
  onPointClick,
  onPointDblClick,
  onPointDragMove,
  onPointDragStart,
  onPointDragEnd,
  onPointMouseOver,
}: ISplineProps) => {
  return (
    <>
      <Line
        points={spline.edges.flatMap((p) => [p.x, p.y])}
        stroke={"black"}
        tension={tension ?? spline.tension}
        onClick={onClick}
        hitStrokeWidth={20}
        listening={linehitbox}
      />
      <Line
        points={spline.edges.flatMap((p) => [p.x, p.y])}
        stroke={"black"}
        tension={(tension ?? spline.tension)+0.05}
        onClick={onClick}
        hitStrokeWidth={20}
        listening={linehitbox}
      />
      {/* <Shape
        strokeWidth={1}
        stroke="red"
        hitStrokeWidth={10}
        onClick={() => console.log("Clicked")}
        sceneFunc={(context, shape) => {
          context.beginPath();
          drawBSpline(context, spline);
          context.lineWidth = shape.strokeWidth();
          // context.strokeStyle = "rgba(0,0,255,0.6)";
          context.strokeStyle = shape.stroke();
          context.stroke();
        }}
        hitFunc={(context, shape) => {
          context.beginPath();
          drawBSpline(context, spline);
          let hsw = shape.hitStrokeWidth();
          context.lineWidth = hsw !== "auto" ? hsw : shape.strokeWidth();
          // context.strokeStyle = "rgba(0,0,255,0.6)";
          context.strokeStyle = shape.stroke();
          context.stroke();
        }}
      /> */}
      {editable &&
        Array.from(spline.points).map(([id, p]) => {
          return (
            <Fragment key={id}>
              <Circle {...p} radius={5} fill="black" listening={false} />
              {(typeof pointhitbox === "function"
                ? pointhitbox(id)
                : pointhitbox) && (
                <Circle
                  {...p}
                  radius={10}
                  draggable
                  onClick={(e) =>
                    onPointClick?.({ pointId: id, konvaEvent: e })
                  }
                  onDblClick={(e) =>
                    onPointDblClick?.({ pointId: id, konvaEvent: e })
                  }
                  onDragMove={(e) =>
                    onPointDragMove?.({ pointId: id, konvaEvent: e })
                  }
                  onDragStart={(e) =>
                    onPointDragStart?.({ pointId: id, konvaEvent: e })
                  }
                  onDragEnd={(e) =>
                    onPointDragEnd?.({ pointId: id, konvaEvent: e })
                  }
                  onMouseOver={(e) =>
                    onPointMouseOver?.({ pointId: id, konvaEvent: e })
                  }
                />
              )}
            </Fragment>
          );
        })}
    </>
  );
};
export default Spline;
