import type {
  SkiaMutableValue,
  SkMatrix,
  SkRect,
  Skia,
} from "@shopify/react-native-skia";
import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface GestureHandlerProps {
  dimensions: SkRect;
  onSelect: () => void;
  scale: SharedValue<number>;
  selected: boolean;
  x: SharedValue<number>;
  y: SharedValue<number>;
}

const OUTLINE_WIDTH = 3;

export const GestureHandler = ({
  dimensions,
  onSelect,
  scale,
  selected,
  x,
  y,
}: GestureHandlerProps) => {
  const tap = Gesture.Tap().onStart(() => {
    runOnJS(onSelect)();
  });

  const pan = Gesture.Pan()
    .onStart(() => {
      runOnJS(onSelect)();
    })
    .onChange((e) => {
      x.value = x.value + e.changeX / scale.value;
      y.value = y.value + e.changeY / scale.value;
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      // state.modify((value) => {
      //   "worklet";
      //   value[id].scale = value[id].savedScale * e.scale;
      //   return value;
      // });
    })
    .onEnd(() => {
      // state.modify((value) => {
      //   "worklet";
      //   value[id].savedScale = value[id].scale;
      //   return value;
      // });
    });

  const rotate = Gesture.Rotation()
    .onChange((e) => {
      // state.modify((value) => {
      //   "worklet";
      //   value[id].rotation = value[id].savedRotation + e.rotation;
      //   return value;
      // });
    })
    .onEnd(() => {
      // state.modify((value) => {
      //   "worklet";
      //   value[id].savedRotation = value[id].rotation;
      //   return value;
      // });
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
      // { scale: state.value[id].scale },
      // { rotateZ: `${(rotation.value / Math.PI) * 180}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(tap, pan, rotate, pinch)}>
      <Animated.View style={animatedStyle} />
    </GestureDetector>
  );
};
