import { useEffect, useMemo } from "react";
import {
  Paragraph,
  Skia,
  useFonts,
  TextAlign,
} from "@shopify/react-native-skia";
import { TextElement } from "./ElementContext";

interface CustomParagraphProps {
  color?: string;
  text: string;
  width: number;
  update: (element: Partial<TextElement>) => void;
}

export const CustomParagraph = ({
  update,
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
    const para = Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr)
      .pushStyle(textStyle)
      .addText(text)
      .pop()
      .build();

    para.layout(width);
    return para;
  }, [customFontMgr, text, width]);

  const height = paragraph?.getHeight() ?? 0;

  useEffect(() => {
    update({ size: { width, height } });
  }, [height]);

  // Render the paragraph
  return <Paragraph paragraph={paragraph} x={0} y={0} width={width} />;
};
