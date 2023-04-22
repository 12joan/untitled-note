import { DependencyList, useEffect } from 'react';

export type EventListener<T extends unknown[]> = (...args: T) => void;
type EventListenerSet<T extends unknown[]> = Set<EventListener<T>>;

export type BaseEventTypes = { [key: string]: unknown[] };

type EventListenerMap<T extends BaseEventTypes> = {
  [K in keyof T]: EventListenerSet<T[K]>;
};

export type EventEmitter<T extends BaseEventTypes> = {
  eventListenerMap: EventListenerMap<T>;
  addEventListener<K extends keyof T>(
    eventName: K,
    listener: EventListener<T[K]>
  ): void;
  removeEventListener<K extends keyof T>(
    eventName: K,
    listener: EventListener<T[K]>
  ): void;
  dispatchEvent<K extends keyof T>(eventName: K, ...args: T[K]): void;
};

export const createEventEmitter = <
  T extends BaseEventTypes
>(): EventEmitter<T> => {
  const eventListenerMap: EventListenerMap<T> = {} as EventListenerMap<T>;

  const addEventListener = <K extends keyof T>(
    eventName: K,
    listener: EventListener<T[K]>
  ) => {
    if (!eventListenerMap[eventName]) {
      eventListenerMap[eventName] = new Set();
    }

    eventListenerMap[eventName].add(listener);
  };

  const removeEventListener = <K extends keyof T>(
    eventName: K,
    listener: EventListener<T[K]>
  ) => {
    eventListenerMap[eventName]?.delete(listener);
  };

  const dispatchEvent = <K extends keyof T>(eventName: K, ...args: T[K]) => {
    const listeners = eventListenerMap[eventName];

    if (listeners) {
      [...listeners].forEach((listener) => listener(...args));
    }
  };

  return {
    eventListenerMap,
    addEventListener,
    removeEventListener,
    dispatchEvent,
  };
};

export const useEvent = <T extends BaseEventTypes, K extends keyof T>(
  eventEmitter: EventEmitter<T>,
  eventName: K,
  handler: EventListener<T[K]>,
  deps?: DependencyList
) => {
  useEffect(() => {
    eventEmitter.addEventListener(eventName, handler);

    return () => {
      eventEmitter.removeEventListener(eventName, handler);
    };
  }, deps);
};

export const dispatchEvent = <T extends BaseEventTypes, K extends keyof T>(
  eventEmitter: EventEmitter<T>,
  eventName: K,
  ...args: T[K]
) => {
  eventEmitter.dispatchEvent(eventName, ...args);
};
