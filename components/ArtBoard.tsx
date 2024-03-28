import React from "react";
import { Canvas, useFont } from "@shopify/react-native-skia";

import { useElementContext } from "./ElementContext";
import { Element } from "./Element";

import { GestureHandler } from "./GestureHandler";
import { SharedValue } from "react-native-reanimated";
import { PathTransformHandler } from "./PathTransformHandler";

export const DEFAULT_WIDTH = 1200;
export const DEFAULT_HEIGHT = 1200;

interface ArtBoardProps {
  canvasScale: SharedValue<number>;
}

export const ArtBoard = ({ canvasScale }: ArtBoardProps) => {
  const { elements, updateElement } = useElementContext();

  return (
    <>
      <Canvas
        style={{
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
          backgroundColor: "white",
        }}
      >
        {elements.map((element) => (
          <Element key={element.id} element={element} update={updateElement} />
        ))}
      </Canvas>
      {elements.map((element) => (
        <>
          <GestureHandler
            key={element.id}
            element={element}
            canvasScale={canvasScale}
          >
            {element.type === "FreeLineText" ? (
              <PathTransformHandler
                points={element.points}
                canvasScale={canvasScale}
              />
            ) : null}
          </GestureHandler>
        </>
      ))}
    </>
  );
};
