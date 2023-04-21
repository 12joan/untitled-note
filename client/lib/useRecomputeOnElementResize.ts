import { useEffect, useReducer, useState } from 'react';

export const useRecomputeOnElementResize =
  <T, Element extends HTMLElement>(fn: (element: Element | null) => T) =>
  (initialElement: Element | null = null) => {
    const [element, setElement] = useState<Element | null>(initialElement);

    const value = fn(element);

    const [, forceRender] = useReducer((x) => x + 1, 0);

    // Re-render when the element resizes
    useEffect(() => {
      const resizeObserver = new ResizeObserver(() => forceRender());
      if (element) resizeObserver.observe(element);
      return () => resizeObserver.disconnect();
    }, [element]);

    return [value, setElement, forceRender] as const;
  };
