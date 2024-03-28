import React from "react";
import { SkMatrix } from "@shopify/react-native-skia";
import { StyleSheet, Text, Button, TextInput } from "react-native";
import Animated, {
  SlideInRight,
  SlideOutRight,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { useElementContext } from "./ElementContext";
import {
  decomposeRotationRadians,
  decomposeScale,
  degreesToRadians,
  radiansToDegrees,
  rotate,
  scale,
} from "../utils/matrix";

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
  textInput: {
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 10,
    marginBottom: 10,
  },
});

export const RightPanel = () => {
  const [selectedElementScale, setSelectedElementScale] =
    React.useState<number>(1);
  const [selectedElementRotation, setSelectedElementRotation] =
    React.useState<number>(0);

  const { selectedElement, updateElement, removeElement } = useElementContext();
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

  return (
    selectedElement && (
      <Animated.View
        entering={SlideInRight}
        exiting={SlideOutRight}
        style={[styles.menu]}
      >
        <Text>Rotation: {Math.floor(selectedElementRotation)}°</Text>
        <Slider
          style={styles.slider}
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
        <Text>Scale: {selectedElementScale.toFixed(2)}</Text>
        <Slider
          style={styles.slider}
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

        {selectedElement.type === "Text" ||
          (selectedElement.type === "FreeLineText" && (
            <TextInput
              editable
              multiline
              onChangeText={(text) =>
                updateElement(selectedElement.id, { content: text })
              }
              value={selectedElement.content}
              style={styles.textInput}
            />
          ))}

        <Button
          title="Delete"
          onPress={() => removeElement(selectedElement.id)}
        />
      </Animated.View>
    )
  );

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
