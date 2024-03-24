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
import sfMono from "../assets/fonts/SF-Mono-Medium.otf";

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 1024;

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
          {elements.map((element) => (
            <GestureHandler
              x={element.x}
              y={element.y}
              scale={scale}
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
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
