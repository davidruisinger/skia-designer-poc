import React from "react";
import { MatrixIndex, SkMatrix, Skia } from "@shopify/react-native-skia";
import { StyleSheet, View, Text as RNText, Button } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SlideInRight,
  SlideOutRight,
  makeMutable,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { ElementProps, useElementContext } from "./ElementContext";
import cuid from "cuid";
import { ArtBoard } from "./ArtBoard";
import {
  decomposeRotationRadians,
  decomposeScale,
  degreesToRadians,
  radiansToDegrees,
  rotate,
  scale,
} from "./MatrixHelpers";

const styles = StyleSheet.create({
  menu: {
    width: "30%",
    backgroundColor: "white",
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    shadowColor: "00000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    padding: 10,
  },
});

export const Editor = () => {
  const [selectedElementScale, setSelectedElementScale] =
    React.useState<number>(1);
  const [selectedElementRotation, setSelectedElementRotation] =
    React.useState<number>(0);

  const { addElement, selectElement, selectedElement, removeElement } =
    useElementContext();
  const [origin, setOrigin] = React.useState<SkMatrix | null>(null);

  useDerivedValue(() => {
    if (selectedElement) {
      runOnJS(updateState)();
    }
  });

  function updateState() {
    if (selectedElement) {
      setSelectedElementScale(decomposeScale(selectedElement.matrix.value));
      setSelectedElementRotation(
        radiansToDegrees(decomposeRotationRadians(selectedElement.matrix.value))
      );
    }
  }

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
        {selectedElement && (
          <Animated.View
            entering={SlideInRight}
            exiting={SlideOutRight}
            style={[styles.menu]}
          >
            <RNText>Rotation: {selectedElementRotation}°</RNText>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={360}
              minimumTrackTintColor="lightgrey"
              maximumTrackTintColor="black"
              onValueChange={(value) => {
                handleElementRotate(value);
              }}
              value={radiansToDegrees(
                decomposeRotationRadians(selectedElement.matrix.value)
              )}
              onTouchStart={() => setOrigin(selectedElement.matrix.value)}
            />
            <RNText>Scale: {selectedElementScale.toFixed(2)}</RNText>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={2}
              minimumTrackTintColor="lightgrey"
              maximumTrackTintColor="black"
              value={decomposeScale(selectedElement.matrix.value)}
              onValueChange={(value) => {
                handleElementScale(value);
              }}
              onTouchStart={() => {
                setOrigin(selectedElement.matrix.value);
              }}
            />
            <Button
              title="Delete"
              onPress={() => removeElement(selectedElement.id)}
            />
          </Animated.View>
        )}
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

  function handleElementRotate(deg: number) {
    if (!selectedElement || !origin) return;

    // This is only needed since we are rotating from a slider which should not rotate on top of the current rotation
    // but instead rotate from the original rotation
    const currentRotationRadians = decomposeRotationRadians(origin);
    const newRotationDeg = deg - radiansToDegrees(currentRotationRadians);
    const radians = degreesToRadians(newRotationDeg);

    selectedElement.matrix.value = rotate(origin, radians, {
      x: selectedElement.size.width / 2,
      y: selectedElement.size.height / 2,
    });
  }

  function handleElementScale(factor: number) {
    if (!selectedElement || !origin) return;

    // Currently we always scale from the center
    const focus = {
      x: selectedElement.size.width / 2,
      y: selectedElement.size.height / 2,
    };

    // This is only needed since we are scaling from a slider which should not scale on top of the current scale
    // but instead scale from the original scale
    const currentScale = decomposeScale(origin);
    const newScale = factor / currentScale;
    if (newScale === 0) return;

    selectedElement.matrix.value = scale(origin, newScale, focus);
  }
};
