import {
  getLocalStorage,
  setLocalStorage,
  useLocalStorage,
} from '~/lib/localStorage';

export interface MakeLocalHistoryOptions {
  key: string;
}

type MakeLocalHistoryResult<T> = {
  touchItem: (item: T) => void;
  removeItem: (item: T) => void;
  getItems: () => T[];
  useItems: () => T[];
};

export const makeLocalHistory = <T>({
  key,
}: MakeLocalHistoryOptions): MakeLocalHistoryResult<T> => {
  const touchItem = (item: T) => {
    const oldItems = getLocalStorage<T[]>(key) ?? [];
    const newItems = [item, ...oldItems.filter((oldItem) => oldItem !== item)];
    setLocalStorage(key, newItems);
  };

  const removeItem = (item: T) => {
    const oldItems = getLocalStorage<T[]>(key) ?? [];
    const newItems = oldItems.filter((oldItem) => oldItem !== item);
    setLocalStorage(key, newItems);
  };

  const getItems = () => getLocalStorage<T[]>(key) ?? [];
  const useItems = () => useLocalStorage(key, []);

  return { touchItem, removeItem, getItems, useItems };
};
