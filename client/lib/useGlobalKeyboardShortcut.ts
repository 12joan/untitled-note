import { DependencyList, KeyboardEvent } from 'react';
import { useKeyboardShortcut } from '~/lib/useKeyboardShortcut';

export const useGlobalKeyboardShortcut = (
  keys: string | string[],
  callback: (event: KeyboardEvent, key: string) => void,
  deps: DependencyList = []
) => {
  // TODO: Deprecate useKeyboardShortcut
  useKeyboardShortcut(() => document.body, keys, callback, deps);
};
