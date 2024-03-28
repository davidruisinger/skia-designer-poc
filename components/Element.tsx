import {
  Group,
  Circle,
  TextPath,
  Rect,
  SkFont,
  rect,
  Skia,
} from "@shopify/react-native-skia";
import { ElementProps } from "./ElementContext";
import { CustomParagraph } from "./CustomParagraph";

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
        <CustomParagraph width={element.size.width} text={element.content} />
      ) : null}
    </Group>
  );
};
