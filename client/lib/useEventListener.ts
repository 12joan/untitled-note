import { DependencyList, useEffect } from 'react';

export const useEventListener = <T extends Event>(
  target: EventTarget,
  event: string,
  callback: (event: T) => void,
  dependencies: DependencyList = []
) => {
  useEffect(() => {
    target.addEventListener(event, callback as EventListener);
    return () => target.removeEventListener(event, callback as EventListener);
  }, dependencies);
};
