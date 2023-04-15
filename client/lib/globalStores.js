import { useState } from 'react';
import { dispatchGlobalEvent, useGlobalEvent } from '~/lib/globalEvents';

const stores = {};

const storeExists = (name) => name in stores;
const getStore = (name) => stores[name];
const setStore = (name, value) => {
  stores[name] = value;
};

const eventForStore = (name) => `store:${name}`;

const useGlobalStore = (
  name,
  initialValue = undefined,
  createIfNotExists = true
) => {
  // Cases:
  // 1. Store exists => return it
  // 2. Store doesn't exist and createIfNotExists => create it and return it
  // 3. Store doesn't exist and !createIfNotExists => return initialValue
  const [storeValue, setStoreValue] = useState(() => {
    if (storeExists(name)) {
      return getStore(name);
    }

    if (createIfNotExists) {
      const resolvedValue =
        typeof initialValue === 'function' ? initialValue() : initialValue;

      setStore(name, resolvedValue);
      return resolvedValue;
    }

    return initialValue;
  });

  useGlobalEvent(eventForStore(name), setStoreValue, []);

  return storeValue;
};

const setGlobalStore = (name, value) => {
  setStore(name, value);
  dispatchGlobalEvent(eventForStore(name), value);
};

const getGlobalStore = getStore;

export { useGlobalStore, setGlobalStore, getGlobalStore };
