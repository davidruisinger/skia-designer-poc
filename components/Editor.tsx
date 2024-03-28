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
import { ElementProps, useElementContext } from "./ElementContext";
import cuid from "cuid";
import { ArtBoard } from "./ArtBoard";
import { RightPanel } from "./RightPanel";

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
          <Button title="Add Rect" onPress={() => handleAddElement("Rect")} />
          <Button
            title="Add Circle"
            onPress={() => handleAddElement("Circle")}
          />
          <Button title="Add Text" onPress={() => handleAddElement("Text")} />
          <Button
            title="Add TextPath"
            onPress={() => handleAddElement("TextPath")}
          />
        </View>
        <Animated.View style={[animatedCanvasStyle]}>
          <ArtBoard canvasScale={canvasScale} />
        </Animated.View>
        <RightPanel />
      </View>
    </GestureDetector>
  );

  function handleAddElement(type: ElementProps["type"]) {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const width = 100;
    const height = 100;

    const x = 100;
    const y = 100;

    const matrix = Skia.Matrix();

    matrix.translate(x, y);

    addElement({
      id: cuid(),
      type,
      size: { width, height },
      matrix: makeMutable(matrix),
      color: randomColor,
    });
  }
};
