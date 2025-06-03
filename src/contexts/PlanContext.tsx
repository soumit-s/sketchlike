import { Spatial } from "@/lib/world";
import { useMap } from "@mantine/hooks";
import React from "react";

interface IPlanContext {
  objects: Map<string, Spatial>;
}

const PlanContext = React.createContext<IPlanContext>({ objects: new Map() });

export const PlanProvider = ({ children }) => {
  const objects = useMap<string, Spatial>();
  return (
    <PlanContext.Provider value={{ objects }}>{children}</PlanContext.Provider>
  );
};

export const usePlan = () => React.useContext(PlanContext);
