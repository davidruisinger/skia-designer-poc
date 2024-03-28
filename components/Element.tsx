import { Group, Circle, Rect } from "@shopify/react-native-skia";
import { ElementProps } from "./ElementContext";
import { TextElement } from "./TextElement";
import { FreeLineText } from "./FreeLineText";

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
        <TextElement
          width={element.size.width}
          update={(updatedElement) => update(element.id, updatedElement)}
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
      ) : null}
    </Group>
  );
};
