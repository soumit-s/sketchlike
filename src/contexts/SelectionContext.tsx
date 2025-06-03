import { useSet } from "@mantine/hooks";
import React from "react";

interface ISelectionContext {
  selections: Set<string>;
}

export const SelectionContext = React.createContext<ISelectionContext>({
  selections: new Set(),
});

export const SelectionProvider = ({ children }) => {
  const selections = useSet<string>();
  return (
    <SelectionContext.Provider value={{ selections }}>
      {children}
    </SelectionContext.Provider>
  );
};
