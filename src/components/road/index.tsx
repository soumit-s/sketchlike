import { Spline2d } from "@/lib/geometry";
import React from "react";
import { Group } from "react-konva"

interface IRoadProps {
  spline: Spline2d;
}

const Road = ({ spline }: IRoadProps) => {
  const normals = React.useMemo(() => {
    const edges = spline.edges;
    const normals: number[] = [];
    for (let i=1; i < spline.edges.length; ++i) {
      const curr = edges[i];
      const prev = edges[i-1];
      const g = (curr.y - prev.y) / (curr.x - prev.x);
      normals.push(-1 / g);
    }
    return normals;
  }, [spline]);
  return <Group></Group>
};


export default Road;