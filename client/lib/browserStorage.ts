import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

type Callback = () => void;
type Callbacks = Set<Callback>;
type SetterFn<T> = (prev: T | null) => T;
type Setter<T> = T | SetterFn<T>;
type PartialStorage = Pick<Storage, 'getItem' | 'setItem'>;

const makeBrowserStorage = (
  storage: PartialStorage,
  listensToStorageEvents = false
) => {
  const subscribers = new Map<string, Callbacks>();

  const notifyForKey = (key: string) =>
    subscribers.get(key)?.forEach((callback) => callback());

  const getStorage = <T>(key: string): T | null => {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  const setStorage = <T>(key: string, setter: Setter<T>) => {
    const value =
      typeof setter === 'function'
        ? (setter as SetterFn<T>)(getStorage(key))
        : setter;
    storage.setItem(key, JSON.stringify(value));
    notifyForKey(key);
  };

  if (listensToStorageEvents) {
    window.addEventListener('storage', (event) => {
      const { key } = event;

      // If the key is null, all keys are affected
      if (key) {
        notifyForKey(event.key!);
      } else {
        [...subscribers.keys()].forEach(notifyForKey);
      }
    });
  }

  const useStorage = <T>(key: string, defaultValue: T) => {
    const getValue = () => getStorage<T>(key) ?? defaultValue;
    const [value, setValue] = useState<T>(getValue);

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

  return { getStorage, setStorage, useStorage };
};

class CookieStorage {
  private readonly session: boolean;

  constructor({ session = false } = {}) {
    this.session = session;
  }

  // eslint-disable-next-line class-methods-use-this
  getItem(key: string) {
    return Cookies.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    Cookies.set(key, value, {
      expires: this.session ? undefined : 365,
      sameSite: 'strict',
      secure: true,
    });
  }
}

export const {
  getStorage: getLocalStorage,
  setStorage: setLocalStorage,
  useStorage: useLocalStorage,
} = makeBrowserStorage(localStorage, true);

export const {
  getStorage: getSessionStorage,
  setStorage: setSessionStorage,
  useStorage: useSessionStorage,
} = makeBrowserStorage(sessionStorage);

export const {
  getStorage: getSessionCookieStorage,
  setStorage: setSessionCookieStorage,
  useStorage: useSessionCookieStorage,
} = makeBrowserStorage(new CookieStorage({ session: true }), false);
