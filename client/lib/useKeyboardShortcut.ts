import { DependencyList, KeyboardEvent, useEffect } from 'react';
import { keyWithModifiers } from '~/lib/keyWithModifiers';

export const useKeyboardShortcut = (
  getElement: () => HTMLElement,
  keys: string | string[],
  callback: (event: KeyboardEvent, key: string) => void,
  deps: DependencyList = []
) => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      const key = keyWithModifiers(event);

      if (!event.defaultPrevented && keyList.includes(key)) {
        callback(event, key);
      }
    };

    const el = getElement();
    el.addEventListener('keydown', handler as any);
    return () => el.removeEventListener('keydown', handler as any);
  }, deps);
};
