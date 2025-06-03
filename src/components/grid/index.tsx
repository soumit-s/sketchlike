import { useMounted } from "@mantine/hooks";
import React from "react";

interface IGridProps {
  className?: string;
  width: number;
  height: number;
  cellSize: number;
  centerX: number;
  centerY: number;
}

const Grid = ({ className, width, height, ...props }: IGridProps) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const mounted = useMounted();
  const [ctx, setCtx] = React.useState<
    CanvasRenderingContext2D | null | undefined
  >();
  React.useEffect(() => {
    setCtx(ref.current?.getContext("2d"));
  }, [mounted, ref.current]);

  React.useEffect(() => {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      drawGrid(ctx, props);
    }
  });

  return (
    <canvas ref={ref} width={width} height={height} className={className} />
  );
};

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  props: { cellSize; centerX; centerY }
) => {
  drawSubgrid(ctx, { ...props, color: "#EEE", lineWidth: 0.5 }); // "#2475FD"
  drawSubgrid(ctx, {
    ...props,
    cellSize: props.cellSize * 10,
    color: "#EAEAEA",
    lineWidth: 1,
  }); // "#1267F8"
  drawAxis(ctx, props);
};

export function drawSubgrid(
  ctx: CanvasRenderingContext2D,
  { centerX, centerY, cellSize, color, lineWidth = 2 }
) {
  const startX = centerX % cellSize;
  const startY = centerY % cellSize;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  for (let x = startX; x < ctx.canvas.width; x += cellSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
  }
  for (let y = startY; y < ctx.canvas.height; y += cellSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
  }
  ctx.stroke();
}

export function drawAxis(ctx: CanvasRenderingContext2D, { centerX, centerY }) {
  ctx.beginPath();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "#0259EC";
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, ctx.canvas.height);
  ctx.moveTo(0, centerY);
  ctx.lineTo(ctx.canvas.width, centerY);
  ctx.stroke();
}

export default Grid;
