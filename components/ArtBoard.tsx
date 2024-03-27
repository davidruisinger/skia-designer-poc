import React from "react";
import { Canvas, useFont } from "@shopify/react-native-skia";

import { useElementContext } from "./ElementContext";
import { Element } from "./Element";

import sfMono from "../assets/fonts/SF-Mono-Medium.otf";
import { GestureHandler } from "./GestureHandler";
import { SharedValue } from "react-native-reanimated";

export const DEFAULT_WIDTH = 1024;
export const DEFAULT_HEIGHT = 1024;

interface ArtBoardProps {
  canvasScale: SharedValue<number>;
}

export const ArtBoard = ({ canvasScale }: ArtBoardProps) => {
  const { elements } = useElementContext();

  const font = useFont(sfMono, 32);

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
          <Element key={element.id} element={element} font={font} />
        ))}
      </Canvas>
      {elements.map((element) => (
        <GestureHandler
          key={element.id}
          element={element}
          canvasScale={canvasScale}
        />
      ))}
    </>
  );
};
