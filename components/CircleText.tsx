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
  SkPoint,
} from "@shopify/react-native-skia";
import { PathPoint } from "./ElementContext";
import { SharedValue } from "react-native-reanimated";

interface CircleTextProps {
  color?: string;
  text: string;
  fontSize: number;
  width: SharedValue<number>;
}

/**
 *
 * @param param0
 * @returns
 */
export const CircleText = ({
  color,
  text,
  fontSize,
  width,
}: CircleTextProps) => {
  const font = useFont(require("../assets/fonts/SF-Mono-Medium.otf"), fontSize);

  const linePath = usePathValue((path) => {
    "worklet";

    path.addCircle(width.value / 2, width.value / 2, width.value / 2);
  });

  return (
    <Group>
      <TextPath
        color={color}
        font={font}
        path={linePath}
        text={text}
        opacity={0.1}
      />
      <Path path={linePath} style={"stroke"} strokeWidth={2} color={"green"} />
    </Group>
  );
};
