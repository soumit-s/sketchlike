import { useVectorEditorTool } from "@/hooks";
import React from "react";
import { twMerge } from "tailwind-merge";

const Tool = ({ children, tool }) => {
  const { tool: currentTool, setTool } = useVectorEditorTool();
  const onClick = React.useCallback(() => setTool(tool), [setTool]);
  return (
    <button
      className={twMerge(
        "rounded-md cursor-pointer p-2 border border-transparent",
        currentTool === tool
          ? "border-neutral-200 bg-neutral-100"
          : "hover:bg-neutral-100"
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default Tool;
