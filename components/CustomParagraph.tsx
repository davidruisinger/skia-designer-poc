import { useMemo } from "react";
import {
  Paragraph,
  Skia,
  useFonts,
  TextAlign,
} from "@shopify/react-native-skia";

interface CustomParagraphProps {
  color?: string;
  text: string;
  width: number;
}

export const CustomParagraph = ({
  color,
  text,
  width,
}: CustomParagraphProps) => {
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
      fontSize: 30,
    };
    return Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
      .pushStyle(textStyle)
      .addText(text)
      .pop()
      .build();
  }, [customFontMgr, text]);
  // Render the paragraph
  return <Paragraph paragraph={paragraph} x={0} y={0} width={width} />;
};