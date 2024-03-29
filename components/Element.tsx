import { Group, Circle, Rect } from "@shopify/react-native-skia";
import { ElementProps } from "./ElementContext";
import { TextElement } from "./TextElement";
import { FreeLineText } from "./FreeLineText";
import { CircleText } from "./CircleText";

export const Element = ({
  element,
  update,
}: {
  update: (id: string, element: Partial<ElementProps>) => void;
  element: ElementProps;
}) => {
  return (
    <Group key={element.id} matrix={element.matrix}>
      {element.type === "Circle" ? (
        <Circle
          cx={element.size.width.value / 2}
          cy={element.size.width.value / 2}
          r={element.size.width.value / 2}
          color={element.color}
        />
      ) : element.type === "Rect" ? (
        <Rect
          width={element.size.width.value}
          height={element.size.height.value}
          color={element.color}
        />
      ) : element.type === "Text" ? (
        <TextElement
          width={element.size.width}
          height={element.size.height}
          text={element.content}
          color={element.color}
          fontSize={element.fontSize}
        />
      ) : element.type === "FreeLineText" ? (
        <FreeLineText
          text={element.content}
          points={element.points}
          fontSize={element.fontSize}
        />
      ) : element.type === "CircleText" ? (
        <CircleText
          text={element.content}
          fontSize={element.fontSize}
          width={element.size.width}
        />
      ) : null}
    </Group>
  );
};
