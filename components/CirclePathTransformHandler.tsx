import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { PathPoint } from "./ElementContext";
import { SkPoint, SkSize } from "@shopify/react-native-skia";

interface CirclePathTransformHandlerProps {
  canvasScale: SharedValue<number>;
  width: SharedValue<number>;
  height: SharedValue<number>;
}

const SIZE = 30;

export const CirclePathTransformHandler = ({
  canvasScale,
  width,
  height,
}: CirclePathTransformHandlerProps) => {
  const points: SkPoint[] = [
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 0,
    },
    {
      x: 2,
      y: 1,
    },
    {
      x: 1,
      y: 2,
    },
  ];

  return points.map((point, i) => (
    <PointGestureHandler
      key={i}
      canvasScale={canvasScale}
      point={point}
      width={width}
      height={height}
      direction={i % 2 === 0 ? "x" : "y"}
    />
  ));
};

interface PointGestureHandlerProps {
  canvasScale: SharedValue<number>;
  point: SkPoint;
  width: SharedValue<number>;
  height: SharedValue<number>;
  direction: "x" | "y";
}

const PointGestureHandler = ({
  canvasScale,
  point,
  direction,
  width,
  height,
}: PointGestureHandlerProps) => {
  const pan = Gesture.Pan().onChange((event) => {
    width.value +=
      direction === "x" ? event.changeX : event.changeY / canvasScale.value;
    height.value +=
      direction === "x" ? event.changeX : event.changeY / canvasScale.value;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: -SIZE / 2,
    left: -SIZE / 2,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: "blue",
    transform: [
      { translateX: (point.x * width.value) / 2 },
      { translateY: (point.y * width.value) / 2 },
    ],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle} />
    </GestureDetector>
  );
};
