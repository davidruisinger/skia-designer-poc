import React from "react";
import { Canvas as SkiaCanvas } from "@shopify/react-native-skia";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const DEFAULT_WIDTH = 1024;
const DEFAULT_HEIGHT = 1024;

interface CanvasProps {
  children: React.ReactNode;
  overlays?: React.ReactNode;
  onTap: () => void;
}

export const Canvas = ({ children, overlays = [], onTap }: CanvasProps) => {
  const translateX = useSharedValue(-70);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.7);
  const savedScale = useSharedValue(1);

  const tap = Gesture.Tap().onStart(() => {
    runOnJS(onTap)();
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
          <SkiaCanvas
            style={{
              width: DEFAULT_WIDTH,
              height: DEFAULT_HEIGHT,
              backgroundColor: "white",
            }}
          >
            {children}
          </SkiaCanvas>
          {overlays}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
