import React from "react";
import {
  Circle,
  Rect,
  Text,
  useFont,
  TextPath,
  Skia,
  rect,
} from "@shopify/react-native-skia";

import { makeMutable } from "react-native-reanimated";
import { GestureHandler } from "./GestureHandler";
import { Canvas } from "./Canvas";

import sfMono from "../assets/fonts/SF-Mono-Medium.otf";

const elements = [
  {
    id: "1",
    type: "Circle",
    r: 100,
    color: "plum",
    x: makeMutable(700),
    y: makeMutable(700),
  },
  {
    id: "2",
    type: "Rect",
    r: 400,
    color: "khaki",
    x: makeMutable(120),
    y: makeMutable(200),
  },
  {
    id: "3",
    type: "Text",
    r: 400,
    color: "khaki",
    x: makeMutable(100),
    y: makeMutable(100),
  },
  {
    id: "4",
    type: "TextPath",
    r: 400,
    color: "khaki",
    x: makeMutable(600),
    y: makeMutable(300),
  },
];

export const Editor = () => {
  const [selectedId, setIsSelectedId] = React.useState<string | null>(null);

  const font = useFont(sfMono, 32);

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

        if (element.type === "Text") {
          return (
            <Text
              font={font}
              x={element.x}
              y={element.y}
              strokeWidth={2}
              color="#8E8E93"
              text="Hello World!"
            />
          );
        }

        if (element.type === "TextPath") {
          const path = Skia.Path.Make();

          path.addArc(
            rect(element.x.value, element.y.value, 254.457273, 120),
            180,
            180
          );
          return (
            <TextPath
              font={font}
              path={path}
              text="This is a sample paragraph. Use it to add"
            />
          );
        }

        return null;
      })}
    </Canvas>
  );
};

// Export Editor as default, we can lazy-load this way easier.
export default Editor;
