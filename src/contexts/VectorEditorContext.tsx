import { IVec2 } from "@/lib/geometry";
import React from "react";

interface IVectorEditorState {
  tool: "selection" | "drawspline" | "drawrect";
  viewport: {
    scale: number;
    translate: IVec2;
  };
}

interface IVectorEditorActions {
  setTool: (tool: IVectorEditorState["tool"]) => void;
  setViewportScale: (
    scale: IVectorEditorState["viewport"]["scale"]
  ) => void;
  setViewportTranslate: (
    translation: IVectorEditorState["viewport"]["translate"]
  ) => void;
}

type IVectorEditorContext = IVectorEditorState & IVectorEditorActions;

const VectorEditorContext = React.createContext<IVectorEditorContext | null>(
  null
);

export const VectorEditorProvider = ({ children }) => {
  const [tool, setTool] =
    React.useState<IVectorEditorState["tool"]>("selection");
  const [viewportScale, setViewportScale] = React.useState<number>(1);
  const [viewportTranslate, setViewportTranslate] = React.useState<IVec2>({
    x: 0,
    y: 0,
  });
  React.useEffect(() => { console.log(">>", viewportScale) }, [viewportScale]);
  const value = React.useMemo(
    () => ({
      tool,
      setTool,
      viewport: {
        scale: viewportScale,
        translate: viewportTranslate,
      },
      setViewportScale,
      setViewportTranslate,
    }),
    [tool, setTool, viewportScale, viewportTranslate, setViewportScale, setViewportTranslate]
  );
  return (
    <VectorEditorContext.Provider value={value}>
      {children}
    </VectorEditorContext.Provider>
  );
};

export const useVectorEditorContext = () =>
  React.useContext(VectorEditorContext);
