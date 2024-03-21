import React from "react";
import { Circle, Rect } from "@shopify/react-native-skia";

import { makeMutable } from "react-native-reanimated";
import { GestureHandler } from "./GestureHandler";
import { Canvas } from "./Canvas";

const elements = [
  {
    id: "1",
    type: "Circle",
    r: 100,
    color: "plum",
    x: makeMutable(600),
    y: makeMutable(600),
  },
  {
    id: "2",
    type: "Rect",
    r: 400,
    color: "khaki",
    x: makeMutable(100),
    y: makeMutable(100),
  },
];

export const Editor = () => {
  const [selectedId, setIsSelectedId] = React.useState<string | null>(null);

  return (
    <Canvas
      onTap={() => setIsSelectedId(null)}
      overlays={elements.map((element) => (
        <GestureHandler
          x={element.x}
          y={element.y}
          id={element.id}
          key={element.id}
          selected={selectedId === element.id}
          onSelect={() => {
            setIsSelectedId(element.id);
          }}
          dimensions={
            element.type === "Circle"
              ? {
                  height: 200,
                  width: 200,
                  x: -100,
                  y: -100,
                }
              : {
                  height: 400,
                  width: 400,
                  x: 0,
                  y: 0,
                }
          }
        />
      ))}
    >
      {elements.map((element) => {
        if (element.type === "Circle") {
          return (
            <Circle
              key={element.id}
              cx={element.x}
              cy={element.y}
              r={element.r}
              color={element.color}
            />
          );
        }
        if (element.type === "Rect") {
          return (
            <Rect
              key={element.id}
              x={element.x}
              y={element.y}
              width={element.r}
              height={element.r}
              color={element.color}
            />
          );
        }
      })}
    </Canvas>
  );
};
