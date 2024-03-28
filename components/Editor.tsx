import React from "react";
import { Skia } from "@shopify/react-native-skia";
import { View, Button } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  makeMutable,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  CircleElement,
  RectElement,
  TextElement,
  useElementContext,
} from "./ElementContext";
import cuid from "cuid";
import { ArtBoard } from "./ArtBoard";
import { RightPanel } from "./RightPanel";
import { getRandomColor } from "@/utils/elements";

export const Editor = () => {
  const { addElement, selectElement, removeElement } = useElementContext();

  const canvasTranslateX = useSharedValue(-70);
  const canvasTranslateY = useSharedValue(0);
  const canvasScale = useSharedValue(0.7);
  const savedScale = useSharedValue(0.7);

  const tap = Gesture.Tap().onStart(() => {
    runOnJS(selectElement)(null);
  });

  const pan = Gesture.Pan().onChange((e) => {
    canvasTranslateX.value += e.changeX;
    canvasTranslateY.value += e.changeY;
  });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      canvasScale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = canvasScale.value;
    });

  const animatedCanvasStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: canvasTranslateX.value,
      },
      {
        translateY: canvasTranslateY.value,
      },
      { scale: canvasScale.value },
    ],
  }));

  return (
    <GestureDetector gesture={Gesture.Race(pinch, pan, tap)}>
      <View style={{ flex: 1, backgroundColor: "lightgrey" }}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            title="Add Rect"
            onPress={() =>
              handleAddElement({
                type: "Rect",
                color: getRandomColor(),
                size: { width: 100, height: 100 },
              })
            }
          />
          <Button
            title="Add Circle"
            onPress={() =>
              handleAddElement({
                type: "Circle",
                color: getRandomColor(),
                size: { width: 100, height: 100 },
              })
            }
          />
          <Button
            title="Add Text"
            onPress={() =>
              handleAddElement({
                type: "Text",
                content: "Add text here...",
                size: { width: 160, height: 0 },
                color: getRandomColor(),
              })
            }
          />
        </View>
        <Animated.View style={[animatedCanvasStyle]}>
          <ArtBoard canvasScale={canvasScale} />
        </Animated.View>
        <RightPanel />
      </View>
    </GestureDetector>
  );

  function handleAddElement(
    element:
      | Omit<TextElement, "matrix" | "id">
      | Omit<RectElement, "matrix" | "id">
      | Omit<CircleElement, "matrix" | "id">
  ) {
    const x = 100;
    const y = 100;

    const matrix = Skia.Matrix();
    matrix.translate(x, y);

    addElement({
      ...element,
      id: cuid(),
      matrix: makeMutable(matrix),
    });
  }
};
