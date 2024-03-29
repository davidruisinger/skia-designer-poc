import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ElementProps, useElementContext } from "./ElementContext";
import { toCSSMatrix, translate } from "../utils/matrix";

interface GestureHandlerProps {
  element: ElementProps;
  canvasScale: SharedValue<number>;
  children?: React.ReactNode;
}

const OUTLINE_WIDTH = 3;

export const GestureHandler = ({
  element,
  canvasScale,
  children,
}: GestureHandlerProps) => {
  const { selectElement, selectedElement } = useElementContext();

  const tap = Gesture.Tap().onStart(() => {
    runOnJS(selectElement)(element);
  });

  const pan = Gesture.Pan()
    .onBegin(() => {
      runOnJS(selectElement)(element);
    })
    .onChange((event) => {
      element.matrix.value = translate(
        element.matrix.value,
        event.changeX / canvasScale.value,
        event.changeY / canvasScale.value
      );
    });

  const isSelected = selectedElement?.id === element.id;

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: element.size.width.value + OUTLINE_WIDTH * 4,
    height: element.size.height.value + OUTLINE_WIDTH * 4,
    top: -OUTLINE_WIDTH * 2,
    left: -OUTLINE_WIDTH * 2,
    borderWidth: OUTLINE_WIDTH,
    borderColor: isSelected ? "blue" : "transparent",
    transform: [
      // NOTE: This is a workaround to make the element transform around its center (as Skia does)
      // instead of the top-left corner (as React Native does).
      {
        translateX: -element.size.width.value / 2,
      },
      {
        translateY: -element.size.height.value / 2,
      },
      { matrix: toCSSMatrix(element.matrix.value) },
      // Reset the translation to the top-left corner
      {
        translateX: element.size.width.value / 2,
      },
      {
        translateY: element.size.height.value / 2,
      },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(tap, pan)}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};
