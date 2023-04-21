import { useState } from 'react';
import { dispatchGlobalEvent, useGlobalEvent } from '~/lib/globalEvents';

const stores: Record<string, any> = {};

const storeExists = (name: string) => name in stores;
const getStore = <T>(name: string) => stores[name] as T;
const setStore = <T>(name: string, value: T) => {
  stores[name] = value;
};

const eventForStore = (name: string) => `store:${name}`;

export const useGlobalStore = <T>(
  name: string,
  initialValue: T | (() => T),
  createIfNotExists = true
): T => {
  /**
   * Cases:
   * 1. Store exists => return it
   * 2. Store doesn't exist and createIfNotExists => create it and return it
   * 3. Store doesn't exist and !createIfNotExists => return initialValue
   */
  const [storeValue, setStoreValue] = useState<T>(() => {
    if (storeExists(name)) {
      return getStore<T>(name);
    }

    const resolvedValue =
      typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;

    if (createIfNotExists) {
      setStore<T>(name, resolvedValue);
    }

    return resolvedValue;
  });

  useGlobalEvent(eventForStore(name), setStoreValue, []);

  return storeValue;
};

export const setGlobalStore = <T>(name: string, value: T) => {
  setStore<T>(name, value);
  dispatchGlobalEvent(eventForStore(name), value);
};

export const getGlobalStore = getStore;
