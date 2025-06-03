import { useElementSize } from "@mantine/hooks";
import { Layer, Stage } from "react-konva";
import { twMerge } from "tailwind-merge";
import VectorEditorToolbar from "./toolbar";
import SelectionToolView from "./SelectionToolView";
import { useVectorEditorTool, useVectorEditorViewport } from "@/hooks";
import DrawSplineToolView from "./DrawSplineToolView";
import Grid from "../grid";
import DrawRectangleToolView from "./DrawRectangleToolView";

const VectorEditor = ({ className = "" }) => {
  const { ref, width, height } = useElementSize();
  const { tool } = useVectorEditorTool();
  const viewport = useVectorEditorViewport();
  return (
    <div ref={ref} className={twMerge("w-screen h-screen relative", className)}>
      <div className="absolute left-0 right-0 bottom-0 py-4 flex justify-center items-center pointer-events-none z-10">
        <VectorEditorToolbar className="pointer-events-auto" />
      </div>
      <Grid
        width={width}
        height={height}
        centerX={0}
        centerY={0}
        cellSize={10 * viewport.scale}
        className="absolute pointer-events-none top-0 left-0 bottom-0 right-0"
      />
      <Stage
        width={width}
        height={height}
        onWheel={(e) => {
          viewport.setScale(
            e.evt.deltaY < 0 ? viewport.scale * 1.1 : viewport.scale * 0.9
          );
        }}
      >
        {/** Layer for structures that are not being edited. */}
        <Layer />
        {/** Layer for structures that are being edited. */}
        {tool === "selection" && <SelectionToolView />}
        {tool === "drawspline" && <DrawSplineToolView />}
        {tool === "drawrect" && <DrawRectangleToolView />}
      </Stage>
    </div>
  );
};

export default VectorEditor;
