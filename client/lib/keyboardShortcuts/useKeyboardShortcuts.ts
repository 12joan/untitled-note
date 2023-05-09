import { useSettings } from '~/lib/settings';
import { useMemo } from 'react';
import { keyboardShortcutCommands } from '~/lib/commands';
import { KeyboardShortcut } from './types';

const keyboardShortcuts: KeyboardShortcut[] = keyboardShortcutCommands.map(
  ({ keyboardShortcut, ...command }) => ({
    ...command,
    ...keyboardShortcut,
  })
);

export const useKeyboardShortcuts = (): KeyboardShortcut[] => {
  const [keyboardShortcutOverrides] = useSettings('keyboardShortcutOverrides');

  return useMemo(
    () =>
      keyboardShortcuts.map((keyboardShortcut) => ({
        ...keyboardShortcut,
        config:
          (keyboardShortcut.id in keyboardShortcutOverrides
            ? keyboardShortcutOverrides[keyboardShortcut.id]
            : keyboardShortcut.config) ?? undefined,
      })),
    [keyboardShortcutOverrides]
  );
};
