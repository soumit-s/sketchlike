import { useVectorEditorContext } from "@/contexts/VectorEditorContext";

export const useVectorEditorTool = () => {
  const { tool, setTool } = useVectorEditorContext()!;
  return { tool, setTool };
};
