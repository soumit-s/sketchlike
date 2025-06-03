import { useMounted } from "@mantine/hooks";
import React from "react";

export const useViewportPan = ({ setTranslate }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const [isMouseDown, setMouseDown] = React.useState<boolean>(false);
  const mouseup = React.useCallback((e: MouseEvent) => {
    if (e.button == 1) {
      setMouseDown(false);
    }
  }, [setMouseDown]);

  const mousemove = React.useCallback((e: MouseEvent) => {
    if (isMouseDown) {
      setTranslate({  });
    }
  }, [isMouseDown]);
  
  const mousedown = React.useCallback((e: MouseEvent) => {
    if (e.button == 1) {
      setMouseDown(true);
    }
  }, [setMouseDown]);

  React.useEffect(() => {
    if (mounted && ref.current) {
      const { current: stage } = ref;

      stage.addEventListener("mouseup", mouseup);
      stage.addEventListener("mousedown", mousedown);
      stage.addEventListener("mousemove", mousemove);

      return () => {
        stage.removeEventListener("mouseup", mouseup);
        stage.removeEventListener("mousedown", mousedown);
        stage.removeEventListener("mousemove", mousemove);
      };
    }
  }, [mounted, ref.current, setTranslate]);
  return { ref };
};
