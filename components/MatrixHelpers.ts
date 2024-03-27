import type { SkMatrix, Vector } from "@shopify/react-native-skia";
import { Skia, MatrixIndex } from "@shopify/react-native-skia";

export const scale = (matrix: SkMatrix, scale: number, origin: Vector) => {
  "worklet";
  const source = Skia.Matrix(matrix.get());
  source.translate(origin.x, origin.y);
  source.scale(scale, scale);
  source.translate(-origin.x, -origin.y);
  return source;
};

export const rotate = (matrix: SkMatrix, radians: number, origin: Vector) => {
  "worklet";
  const source = Skia.Matrix(matrix.get());
  source.translate(origin.x, origin.y);
  source.rotate(radians);
  source.translate(-origin.x, -origin.y);
  return source;
};

export const translate = (matrix: SkMatrix, x: number, y: number) => {
  "worklet";
  const m = Skia.Matrix();
  m.translate(x, y);
  m.concat(matrix);
  return m;
};

/**
 * Transforms a SkMatrix into a CSS 4x4 matrix
 *
 *             │ ScaleX  SkewY   Persp0 │
 * SKMatrix:   │ SkewX   ScaleY  Persp1 │ => [ScaleX, SkewX, TransX, SkewY, ScaleY, TransY, Persp0, Persp1, Persp2]
 *             │ TransX  TransY  Persp2 │
 *
 *             │ ScaleX  SkewY   TransX │
 * CSS Matrix: │ SkewX   ScaleY  TransY │ => [ScaleX, SkewX, Persp0, 0, SkewY, ScaleY, Persp1, 0, 0, 0, 1, 0, 1, TransX, TransY, Persp2]
 *             │ Persp0  Persp1  Persp2 │
 */
export const toCSSMatrix = (skMatrix: SkMatrix) => {
  "worklet";
  const values = skMatrix.get();
  return [
    values[MatrixIndex.ScaleX],
    values[MatrixIndex.SkewY],
    values[MatrixIndex.Persp0],
    0,
    values[MatrixIndex.SkewX],
    values[MatrixIndex.ScaleY],
    values[MatrixIndex.Persp1],
    0,
    0,
    0,
    1,
    0,
    values[MatrixIndex.TransX],
    values[MatrixIndex.TransY],
    values[MatrixIndex.Persp2],
    1,
  ];
};

export function decomposeRotationRadians(matrix: SkMatrix) {
  const matrixValues = matrix.get();
  // Decompose the rotation from the matrix

  const rotation = Math.atan2(
    matrixValues[MatrixIndex.SkewY],
    matrixValues[MatrixIndex.ScaleY]
  );

  // from 180° to 360° we get negative values
  if (rotation < 0) {
    return rotation + 2 * Math.PI; // 2*PI = 360°
  }

  return rotation;
}

export function decomposeScale(matrix: SkMatrix) {
  const matrixValues = matrix.get();

  // Decompose the scale from the matrix
  const scaleX = Math.sqrt(
    Math.pow(matrixValues[MatrixIndex.ScaleX], 2) +
      Math.pow(matrixValues[MatrixIndex.SkewY], 2)
  );

  return scaleX;
}

export function radiansToDegrees(rotation: number) {
  return (rotation * 180) / Math.PI;
}

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}
