import { usePlan } from "@/contexts";

export const usePlanObjects = () => {
  const { objects } = usePlan();
  return objects;
};
