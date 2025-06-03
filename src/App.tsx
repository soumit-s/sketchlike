import Editor from "./components/plan-editor/Editor";
import VectorEditor from "./components/vector-editor/VectorEditor";
import { PlanProvider, VectorEditorProvider } from "@/contexts";

const App = () => (
  <div>
    <PlanProvider>
      <VectorEditorProvider>
        <VectorEditor />
      </VectorEditorProvider>
    </PlanProvider>
  </div>
);
export default App;
