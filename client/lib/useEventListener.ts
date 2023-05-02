import { DependencyList, useEffect } from 'react';

export const useEventListener = <T extends Event>(
  target: EventTarget,
  event: string,
  callback: (event: T) => void,
  dependencies: DependencyList = [],
  useCapture = false,
) => {
  useEffect(() => {
    target.addEventListener(event, callback as EventListener, useCapture);
    return () => target.removeEventListener(event, callback as EventListener, useCapture);
  }, dependencies);
};
