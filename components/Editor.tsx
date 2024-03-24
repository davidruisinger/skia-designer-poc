import React from "react";
import {
  Circle,
  Rect,
  Text,
  useFont,
  TextPath,
  Skia,
  rect,
  Canvas,
  Group,
} from "@shopify/react-native-skia";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  makeMutable,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { GestureHandler } from "./GestureHandler";
import { Element, ElementProps } from "./Element";
import sfMono from "../assets/fonts/SF-Mono-Medium.otf";

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 1024;

const elements: ElementProps[] = [
  {
    id: "1",
    type: "Circle",
    width: 200,
    height: 200,
    color: "plum",
    x: makeMutable(700),
    y: makeMutable(700),
    rotation: makeMutable(0),
    scale: makeMutable(1),
  },
  {
    id: "2",
    type: "Rect",
    width: 400,
    height: 400,
    color: "khaki",
    x: makeMutable(120),
    y: makeMutable(200),
    rotation: makeMutable(0),
    scale: makeMutable(1),
  },
  {
    id: "3",
    type: "Text",
    width: 400,
    height: 100,
    color: "khaki",
    x: makeMutable(100),
    y: makeMutable(100),
    rotation: makeMutable(0),
    scale: makeMutable(1),
  },
  {
    id: "4",
    type: "TextPath",
    width: 180,
    height: 120,
    color: "khaki",
    x: makeMutable(600),
    y: makeMutable(300),
    rotation: makeMutable(0),
    scale: makeMutable(1),
  },
];

export const Editor = () => {
  const [selectedId, setIsSelectedId] = React.useState<string | null>(null);

  const font = useFont(sfMono, 32);

  const translateX = useSharedValue(-70);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.7);
  const savedScale = useSharedValue(0.7);

  const tap = Gesture.Tap().onStart(() => {
    runOnJS(setIsSelectedId)(null);
  });

  const pan = Gesture.Pan().onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;
  });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(pinch, pan, tap)}>
      <View style={{ flex: 1, backgroundColor: "lightgrey" }}>
        <Animated.View style={[animatedStyle]}>
          <Canvas
            style={{
              width: DEFAULT_WIDTH,
              height: DEFAULT_HEIGHT,
              backgroundColor: "white",
            }}
          >
            {elements.map((element) => (
              <Element element={element} font={font} />
            ))}
          </Canvas>
          {elements.map((element) => (
            <GestureHandler
              x={element.x}
              y={element.y}
              canvasScale={scale}
              key={element.id}
              selected={selectedId === element.id}
              onSelect={() => {
                setIsSelectedId(element.id);
              }}
              scale={element.scale}
              rotation={element.rotation}
              dimensions={{
                x: element.type === "Circle" ? -element.width / 2 : 0,
                y: element.type === "Circle" ? -element.height / 2 : 0,
                width: element.width,
                height: element.height,
              }}
            />
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
