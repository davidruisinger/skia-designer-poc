import { Skia, type SkMatrix, type SkSize } from "@shopify/react-native-skia";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { ReactNode } from "react";
import { makeMutable, type SharedValue } from "react-native-reanimated";

export interface BaseElement {
  id: string;
  matrix: SharedValue<SkMatrix>;
  size: SkSize;
}

export interface TextElement extends BaseElement {
  type: "Text";
  content: string;
  color: string;
}

export interface RectElement extends BaseElement {
  type: "Rect";
  color: string;
}

export interface CircleElement extends BaseElement {
  type: "Circle";
  color: string;
}

export type ElementProps = TextElement | RectElement | CircleElement;

interface ElementContext {
  elements: ElementProps[];
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  dispatch: (action: ElementAction) => void;
}

const ElementContext = createContext<ElementContext | null>(null);

type ElementAction =
  | {
      type: "add";
      element: ElementProps;
    }
  | {
      type: "remove";
      id: string;
    };

const elementReducer = (elements: ElementProps[], action: ElementAction) => {
  switch (action.type) {
    case "add":
      return [...elements, action.element];
    case "remove":
      return elements.filter((element) => element.id !== action.id);
  }
};

export const useElementContext = () => {
  const ctx = useContext(ElementContext);
  if (ctx === null) {
    throw new Error("No Element context found");
  }
  const { elements, dispatch, selectedElementId, setSelectedElementId } = ctx;
  const addElement = useCallback(
    (element: ElementProps) => {
      dispatch({ type: "add", element });
    },
    [dispatch]
  );

  const removeElement = useCallback(
    (id: string) => {
      dispatch({ type: "remove", id });
    },
    [dispatch]
  );

  const selectElement = useCallback(
    (element: ElementProps | null) => {
      setSelectedElementId(element?.id ?? null);
    },
    [setSelectedElementId]
  );

  const selectedElement = useMemo(() => {
    return elements.find((element) => element.id === selectedElementId) ?? null;
  }, [elements, selectedElementId]);

  return {
    elements,
    selectedElement,
    addElement,
    removeElement,
    selectElement,
  };
};

interface ElementProviderProps {
  children: ReactNode | ReactNode[];
}

export const ElementProvider = ({ children }: ElementProviderProps) => {
  const [elements, dispatch] = useReducer(elementReducer, [
    {
      id: "1",
      type: "Text",
      size: { width: 150, height: 0 },
      matrix: makeMutable(Skia.Matrix().translate(100, 100)),
      color: "blue",
      content: "This is a sample paragraph. Use it to add",
    },
  ]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    "1"
  );

  return (
    <ElementContext.Provider
      value={{ elements, dispatch, selectedElementId, setSelectedElementId }}
    >
      {children}
    </ElementContext.Provider>
  );
};
