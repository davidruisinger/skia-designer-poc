import { SkPoint, SkSize } from "@shopify/react-native-skia";

export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export function getBoundingBoxFromPoints(
  points: SkPoint[],
  extraHeight?: number = 0
): SkSize {
  // Find the min and max x and y values
  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;
  points.forEach((point) => {
    if (point.x < minX) {
      minX = point.x;
    }
    if (point.y < minY) {
      minY = point.y;
    }
    if (point.x > maxX) {
      maxX = point.x;
    }
    if (point.y > maxY) {
      maxY = point.y;
    }
  });

  return {
    height: maxY - minY + extraHeight,
    width: maxX - minX,
  };
}

export function getFreeLineTextPoints(): SkPoint[] {
  return [
    { x: 16.27771295215871, y: 40.43173862310385 },
    { x: 154.5507584597433, y: 43.93232205367565 },
    { x: 158.0574027244251, y: 169.8473390993039 },
    { x: 280.5717619603267, y: 171.7036172695449 },
    { x: 396.0910151691949, y: 173.4539089848308 },
    { x: 401.3418903150525, y: 301.2252042007001 },
    { x: 651.6336056009335, y: 301.2252042007001 },
  ];
}
