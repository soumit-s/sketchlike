import { type Spatial as SpatialType } from "@/lib/world";
import Spline from "@/components/shapes/Spline";
import Rectangle from "@/components/shapes/Rectangle";

interface IStaticSpatialViewProps {
  object: SpatialType;
}

const StaticSpatialView = ({ object }: IStaticSpatialViewProps) => {

  return (
    <>
      {object.type === "spline" && <Spline spline={object.spline} />}
      {object.type === "rect" && <Rectangle rect={object.rect} />}
    </>
  );
}

export default StaticSpatialView;