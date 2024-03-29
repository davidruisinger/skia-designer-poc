import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { PathPoint } from "./ElementContext";

interface FreePathTransformHandlerProps {
  points: PathPoint[];
  canvasScale: SharedValue<number>;
}

const SIZE = 30;

export const FreePathTransformHandler = ({
  canvasScale,
  points,
}: FreePathTransformHandlerProps) => {
  return points.map((point, i) => (
    <PointGestureHandler key={i} canvasScale={canvasScale} point={point} />
  ));
};

interface PointGestureHandlerProps {
  point: PathPoint;
  canvasScale: SharedValue<number>;
}

const PointGestureHandler = ({
  canvasScale,
  point,
}: PointGestureHandlerProps) => {
  const pan = Gesture.Pan().onChange((event) => {
    point.x.value += event.changeX / canvasScale.value;
    point.y.value += event.changeY / canvasScale.value;
  });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: -SIZE / 2,
    left: -SIZE / 2,
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: "blue",
    transform: [{ translateX: point.x.value }, { translateY: point.y.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle} />
    </GestureDetector>
  );
};
