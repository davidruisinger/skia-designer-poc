import type { SkRect } from "@shopify/react-native-skia";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";

interface GestureHandlerProps {
  dimensions: SkRect;
  onSelect: () => void;
  canvasScale: SharedValue<number>;
  selected: boolean;
  x: SharedValue<number>;
  y: SharedValue<number>;
  rotation: SharedValue<number>;
  scale: SharedValue<number>;
}

const OUTLINE_WIDTH = 3;

export const GestureHandler = ({
  dimensions,
  onSelect,
  canvasScale,
  selected,
  x,
  y,
  rotation,
  scale,
}: GestureHandlerProps) => {
  const tap = Gesture.Tap().onStart(() => {
    runOnJS(onSelect)();
  });

  const pan = Gesture.Pan()
    .onStart(() => {
      runOnJS(onSelect)();
    })
    .onChange((e) => {
      x.value = x.value + e.changeX / canvasScale.value;
      y.value = y.value + e.changeY / canvasScale.value;
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      // state.modify((value) => {
      //   "worklet";
      //   value[id].savedScale = value[id].scale;
      //   return value;
      // });
    });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = e.rotation;
    })
    .onEnd(() => {
      // savedRotation.value = rotation.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    left: dimensions.x - OUTLINE_WIDTH,
    top: dimensions.y - OUTLINE_WIDTH,
    width: dimensions.width + OUTLINE_WIDTH * 2,
    height: dimensions.height + OUTLINE_WIDTH * 2,
    borderColor: selected ? "blue" : "transparent",
    borderWidth: OUTLINE_WIDTH,
    transform: [
      {
        translateX: x.value,
      },
      {
        translateY: y.value,
      },
      { scale: scale.value },
      { rotateZ: `${(rotation.value / Math.PI) * 180}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(tap, pan, rotate, pinch)}>
      <Animated.View style={animatedStyle} />
    </GestureDetector>
  );
};
