import { DependencyList, useEffect } from 'react';

export const useEventListener = <EventName extends keyof DocumentEventMap>(
  target: EventTarget | null,
  event: EventName,
  callback: (event: DocumentEventMap[EventName]) => void,
  dependencies: DependencyList = [],
  useCapture = false
) => {
  useEffect(() => {
    if (!target) return;
    target.addEventListener(event, callback as EventListener, useCapture);
    return () =>
      target.removeEventListener(event, callback as EventListener, useCapture);
  }, dependencies);
};
