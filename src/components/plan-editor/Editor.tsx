import { useElementSize } from "@mantine/hooks";
import { Stage } from "react-konva";
import DummyScene from "../test/DummyScene";

const Editor = () => {
  const { ref, width, height } = useElementSize();
  return (
    <div className="w-screen h-screen relative" ref={ref}>
      <Stage width={width} height={height}>
        <DummyScene />
      </Stage>
    </div>
  );
};

export default Editor;
