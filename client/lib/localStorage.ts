import { useEffect, useState } from 'react';

type Callback = () => void;
type Callbacks = Set<Callback>;

const subscribers = new Map<string, Callbacks>();

const notifyForKey = (key: string) =>
  subscribers.get(key)?.forEach((callback) => callback());

export const setLocalStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
  notifyForKey(key);
};

window.addEventListener('storage', (event) => {
  const { key } = event;

  // If the key is null, all keys are affected
  if (key) {
    notifyForKey(event.key!);
  } else {
    [...subscribers.keys()].forEach(notifyForKey);
  }
});

export const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const getValue = () => getLocalStorage(key) ?? defaultValue;
  const [value, setValue] = useState(getValue);

  useEffect(() => {
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }

    const handleChange = () => setValue(getValue());

    const callbacks = subscribers.get(key);
    callbacks?.add(handleChange);

    return () => {
      callbacks?.delete(handleChange);
    };
  }, [key]);

  return value;
};
