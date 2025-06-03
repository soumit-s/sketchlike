import { SelectionContext } from "@/contexts";
import React from "react";

export const useSelections = () => {
  const { selections } = React.useContext(SelectionContext);
  return selections;
};