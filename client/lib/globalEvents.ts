import { DependencyList, useEffect } from 'react';

type EventListener = (...args: any[]) => void;
type EventListeners = Set<EventListener>;

const eventListeners = new Map<string, EventListeners>();

export const useGlobalEvent = (
  eventName: string,
  handler: EventListener,
  deps?: DependencyList
) => {
  useEffect(() => {
    if (!eventListeners.has(eventName)) {
      eventListeners.set(eventName, new Set());
    }

    const listeners = eventListeners.get(eventName);
    listeners?.add(handler);

    return () => {
      listeners?.delete(handler);
    };
  }, deps);
};

export const dispatchGlobalEvent = (eventName: string, ...args: any[]) => {
  const listeners = eventListeners.get(eventName);

  if (listeners) {
    // The [...listeners] prevents infinite loops in case the set is modified by the listener
    [...listeners].forEach((listener) => listener(...args));
  }
};
