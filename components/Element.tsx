import {
  Group,
  useValue,
  Circle,
  TextPath,
  Rect,
  Text,
  SkFont,
  rect,
  Skia,
} from "@shopify/react-native-skia";
import { SharedValue } from "react-native-reanimated";

export interface ElementProps {
  id: string;
  type: "Circle" | "Rect" | "Text" | "TextPath";
  width: number;
  height: number;
  color: string;
  x: SharedValue<number>;
  y: SharedValue<number>;
  rotation: SharedValue<number>;
  scale: SharedValue<number>;
}

export const Element = ({
  element,
  font,
}: {
  element: ElementProps;
  font: SkFont | null;
}) => {
  return (
    <Group key={element.id} transform={[{ scale: element.scale.value }]}>
      {element.type === "Circle" ? (
        <Circle
          cx={element.x}
          cy={element.y}
          r={element.width / 2}
          color={element.color}
        />
      ) : element.type === "Rect" ? (
        <Rect
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          color={element.color}
        />
      ) : element.type === "Text" ? (
        <Text
          font={font}
          x={element.x}
          y={element.y}
          strokeWidth={2}
          color="#8E8E93"
          text="Hello World!"
        />
      ) : element.type === "TextPath" ? (
        <TextPath
          font={font}
          path={Skia.Path.Make().addArc(
            rect(
              element.x.value,
              element.y.value,
              element.width,
              element.height
            ),
            180,
            180
          )}
          text="This is a sample paragraph. Use it to add"
        />
      ) : null}
    </Group>
  );
};
