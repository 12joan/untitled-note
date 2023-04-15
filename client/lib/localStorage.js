import { useEffect, useState } from 'react';

const subscribers = new Map();

const notifyForKey = (key) =>
  subscribers.get(key)?.forEach((callback) => callback());

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  notifyForKey(key);
};

window.addEventListener('storage', (event) => {
  const { key } = event;

  // If the key is null, all keys are affected
  if (key) {
    notifyForKey(event.key);
  } else {
    subscribers.keys().forEach(notifyForKey);
  }
});

const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

const useLocalStorage = (key, defaultValue) => {
  const getValue = () => getLocalStorage(key) ?? defaultValue;
  const [value, setValue] = useState(getValue);

  useEffect(() => {
    if (!subscribers.has(key)) {
      subscribers.set(key, new Set());
    }

    const handleChange = () => setValue(getValue());

    const callbacks = subscribers.get(key);

    callbacks.add(handleChange);

    return () => callbacks.delete(handleChange);
  }, [key]);

  return value;
};

export { setLocalStorage, getLocalStorage, useLocalStorage };
