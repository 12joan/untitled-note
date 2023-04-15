import {
  getLocalStorage,
  setLocalStorage,
  useLocalStorage,
} from '~/lib/localStorage';

const makeLocalHistory = ({ key }) => {
  const touchItem = (item) => {
    const oldItems = getLocalStorage(key) ?? [];
    const newItems = [item, ...oldItems.filter((oldItem) => oldItem !== item)];
    setLocalStorage(key, newItems);
  };

  const removeItem = (item) => {
    const oldItems = getLocalStorage(key) ?? [];
    const newItems = oldItems.filter((oldItem) => oldItem !== item);
    setLocalStorage(key, newItems);
  };

  const getItems = () => getLocalStorage(key) ?? [];
  const useItems = () => useLocalStorage(key, []);

  return { touchItem, removeItem, getItems, useItems };
};

export default makeLocalHistory;
