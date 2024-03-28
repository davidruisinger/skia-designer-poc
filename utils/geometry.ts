import type { SkRect } from "@shopify/react-native-skia";
import { rect } from "@shopify/react-native-skia";

export function inflate(rct: SkRect, amount: number) {
  return rect(
    rct.x - amount,
    rct.y - amount,
    rct.width + amount * 2,
    rct.height + amount * 2
  );
}

export function deflate(rct: SkRect, amount: number) {
  return rect(
    rct.x + amount,
    rct.y + amount,
    rct.width - amount * 2,
    rct.height - amount * 2
  );
}
