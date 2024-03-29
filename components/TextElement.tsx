import { useEffect, useMemo } from "react";
import {
  Paragraph,
  Skia,
  useFonts,
  TextAlign,
} from "@shopify/react-native-skia";
import { type TextElement as TextElementType } from "./ElementContext";
import { SharedValue } from "react-native-reanimated";

interface TextElementProps {
  color?: string;
  text: string;
  fontSize: number;
  width: SharedValue<number>;
  height: SharedValue<number>;
}

export const TextElement = ({
  height,
  color,
  text,
  width,
  fontSize,
}: TextElementProps) => {
  const customFontMgr = useFonts({
    SFMono: [require("../assets/fonts/SF-Mono-Medium.otf")],
  });
  const paragraph = useMemo(() => {
    // Are the font loaded already?
    if (!customFontMgr) {
      return null;
    }
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const textStyle = {
      color: Skia.Color(color ?? "#000000"),
      fontFamilies: ["SFMono"],
      fontSize,
    };
    const para = Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
      .pushStyle(textStyle)
      .addText(text)
      .pop()
      .build();

    para.layout(width.value);
    return para;
  }, [customFontMgr, text, width]);

  height.value = paragraph?.getHeight() ?? 0;

  // Render the paragraph
  return <Paragraph paragraph={paragraph} x={0} y={0} width={width} />;
};
