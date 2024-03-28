import { useEffect, useMemo } from "react";
import {
  Skia,
  TextPath,
  useFont,
  Group,
  Path,
  SkPath,
  usePathValue,
  processTransform3d,
} from "@shopify/react-native-skia";
import { PathPoint } from "./ElementContext";

interface FreeLineTextProps {
  color?: string;
  text: string;
  fontSize: number;
  points: PathPoint[];
}

/**
 *
 * @param param0
 * @returns
 */
export const FreeLineText = ({
  color,
  text,
  points,
  fontSize,
}: FreeLineTextProps) => {
  const font = useFont(require("../assets/fonts/SF-Mono-Medium.otf"), fontSize);

  const controlPath = usePathValue((path) => {
    "worklet";
    points.forEach((point, index) => {
      path.moveTo(point.x.value, point.y.value);

      if (index % 3 === 0) {
        // Draw a line to the previous point (if it exists)
        if (index > 0) {
          const previousPoint = points[index - 1];
          path.lineTo(previousPoint.x.value, previousPoint.y.value);
          path.moveTo(point.x.value, point.y.value);
        }
        // Draw a line to the next point (if it exists)
        if (index < points.length - 1) {
          const nextPoint = points[index + 1];
          path.lineTo(nextPoint.x.value, nextPoint.y.value);
        }
      }
    });
  });

  const linePath = usePathValue((path) => {
    "worklet";
    path.moveTo(points[0].x.value, points[0].y.value);

    path.cubicTo(
      points[1].x.value,
      points[1].y.value,
      points[2].x.value,
      points[2].y.value,
      points[3].x.value,
      points[3].y.value
    );
    path.cubicTo(
      points[4].x.value,
      points[4].y.value,
      points[5].x.value,
      points[5].y.value,
      points[6].x.value,
      points[6].y.value
    );
  });

  return (
    <Group>
      <TextPath
        color={color}
        font={font}
        path={linePath}
        text={text}
        opacity={0.1}
        // transform={[{ translateY: 28 }]}
      />
      <Path
        path={controlPath}
        style={"stroke"}
        strokeWidth={2}
        color={"blue"}
      />
      <Path path={linePath} style={"stroke"} strokeWidth={2} color={"green"} />
    </Group>
  );
};
