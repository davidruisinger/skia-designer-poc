import {
  getBoundingBoxFromPoints,
  getFreeLineTextPoints,
} from "@/utils/elements";
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

export interface PathPoint {
  x: SharedValue<number>;
  y: SharedValue<number>;
}

export interface BaseElement {
  id: string;
  matrix: SharedValue<SkMatrix>;
  size: {
    width: SharedValue<number>;
    height: SharedValue<number>;
  };
}

export interface TextElement extends BaseElement {
  type: "Text";
  content: string;
  color: string;
  fontSize: number;
}

export interface FreeLineTextElement extends BaseElement {
  type: "FreeLineText";
  content: string;
  color: string;
  points: PathPoint[];
  fontSize: number;
}

export interface CircleTextElement extends BaseElement {
  type: "CircleText";
  content: string;
  color: string;
  fontSize: number;
}

export interface DistortTextElement extends BaseElement {
  type: "DistortText";
  content: string;
  color: string;
  fontSize: number;
  points: PathPoint[];
}

export interface RectElement extends BaseElement {
  type: "Rect";
  color: string;
}

export interface CircleElement extends BaseElement {
  type: "Circle";
  color: string;
}

export type ElementProps =
  | TextElement
  | FreeLineTextElement
  | CircleTextElement
  | DistortTextElement
  | RectElement
  | CircleElement;

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
    }
  | {
      type: "update";
      id: string;
      element: Partial<ElementProps>;
    };

const elementReducer = (elements: ElementProps[], action: ElementAction) => {
  switch (action.type) {
    case "add":
      return [...elements, action.element];
    case "update":
      return elements.map((element) =>
        element.id === action.id
          ? ({
              ...element,
              ...action.element,
            } as ElementProps)
          : element
      );
    case "remove":
      return elements.filter((element) => element.id !== action.id);
    default:
      return elements;
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

  const updateElement = useCallback(
    (id: string, element: Partial<ElementProps>) => {
      dispatch({ type: "update", id, element });
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
    updateElement,
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
      type: "DistortText",
      matrix: makeMutable(Skia.Matrix().translate(0, 0)),
      color: "blue",
      content: "This is a sample paragraph. Use it to add anything you like",
      fontSize: 72,
      size: {
        width: makeMutable(280),
        height: makeMutable(335),
      },
      points: [],
    },
  ]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );

  return (
    <ElementContext.Provider
      value={{ elements, dispatch, selectedElementId, setSelectedElementId }}
    >
      {children}
    </ElementContext.Provider>
  );
};
