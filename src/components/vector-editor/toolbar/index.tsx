import { twMerge } from "tailwind-merge";
import Tool from "./Tool";
import { SplineIcon, SquareDashedIcon, SquareIcon } from "lucide-react";

const VectorEditorToolbar = ({ className = "" }) => {
  return (
    <nav className={twMerge("p-1 border border-neutral-200 bg-neutral-50 rounded-md shadow flex gap-2", className)}>
      <Tool tool="selection">
        <SquareDashedIcon/>
      </Tool>
      <Tool tool="drawspline">
        <SplineIcon/>
      </Tool>
      <Tool tool="drawrect">
        <SquareIcon/>
      </Tool>
    </nav>
  );
};
export default VectorEditorToolbar;
