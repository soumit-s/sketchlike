import { useMounted } from "@mantine/hooks";
import Konva from "konva";
import React from "react";

export const useLayerSize = () => {
  const ref = React.useRef<Konva.Layer>(null);
  const isMounted = useMounted();
  const [width, height] = React.useMemo(
    () => [ref.current?.width(), ref.current?.height()],
    [ref.current, isMounted]
  );
  return { ref, width, height };
};
