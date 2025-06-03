import { useVectorEditorContext } from "@/contexts";

export const useVectorEditorViewport = () => {
  const {
    viewport,
    setViewportScale: setScale,
    setViewportTranslate: setTranslate,
  } = useVectorEditorContext()!;
  return { ...viewport, setScale, setTranslate };
};
