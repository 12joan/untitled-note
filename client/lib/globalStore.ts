import { useState } from 'react';
import { dispatchGlobalEvent, useGlobalEvent } from '~/lib/globalEvents';

export type GlobalStoreTypes = {
  dragCursorPosition: number | null;
};

const globalStore: GlobalStoreTypes = {
  dragCursorPosition: null,
};

const eventForKey = <K extends string>(key: K): `store:${K}` => `store:${key}`;

export const useGlobalStore = <K extends keyof GlobalStoreTypes>(key: K) => {
  type Value = GlobalStoreTypes[K];

  const [value, setValue] = useState<Value>(globalStore[key]);

  useGlobalEvent(eventForKey(key), (newValue: Value) => {
    setValue(newValue);
  });

  return value;
};

export const setGlobalStore = <K extends keyof GlobalStoreTypes>(
  key: K,
  value: GlobalStoreTypes[K]
) => {
  globalStore[key] = value;
  dispatchGlobalEvent(eventForKey(key), value);
};

export const getGlobalStore = <K extends keyof GlobalStoreTypes>(key: K) =>
  globalStore[key];
