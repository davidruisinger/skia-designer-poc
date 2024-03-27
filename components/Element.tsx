import {
  Group,
  Circle,
  TextPath,
  Rect,
  Text,
  SkFont,
  rect,
  Skia,
} from "@shopify/react-native-skia";
import { ElementProps } from "./ElementContext";

export const Element = ({
  element,
  font,
}: {
  element: ElementProps;
  font: SkFont | null;
}) => {
  return (
    <Group key={element.id} matrix={element.matrix}>
      {element.type === "Circle" ? (
        <Circle
          cx={element.size.width / 2}
          cy={element.size.width / 2}
          r={element.size.width / 2}
          color={element.color}
        />
      ) : element.type === "Rect" ? (
        <Rect
          width={element.size.width}
          height={element.size.height}
          color={element.color}
        />
      ) : element.type === "Text" ? (
        <Text
          font={font}
          strokeWidth={2}
          color={element.color}
          text="Hello World!"
        />
      ) : element.type === "TextPath" ? (
        <TextPath
          font={font}
          path={Skia.Path.Make().addArc(
            rect(100, 100, element.size.width, element.size.height),
            180,
            180
          )}
          text="This is a sample paragraph. Use it to add"
        />
      ) : null}
    </Group>
  );
};
