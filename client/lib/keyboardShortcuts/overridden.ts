import { useMemo } from 'react';
import {
  globalKeyboardShortcutCommands,
  type KeyboardShortcutCommand,
  keyboardShortcutCommands,
  type LocalKeyboardShortcutCommandId,
  localKeyboardShortcutCommands,
} from '~/lib/commands';
import { useSettings } from '~/lib/settings';
import type { Settings } from '~/lib/types';

const keyboardShortcutCommandWithOverrides = <
  T extends KeyboardShortcutCommand,
>(
  keyboardShortcutCommand: T,
  overrides: Settings['keyboard_shortcut_overrides']
): T => {
  const { id, keyboardShortcut } = keyboardShortcutCommand;

  return {
    ...keyboardShortcutCommand,
    keyboardShortcut: {
      ...keyboardShortcut,
      config:
        (id in overrides ? overrides[id] : keyboardShortcut.config) ??
        undefined,
    },
  };
};

const useOverriddenKeyboardShortcutCommands = <
  T extends KeyboardShortcutCommand,
>(
  keyboardShortcutCommands: T[]
): T[] => {
  const [keyboardShortcutOverrides] = useSettings(
    'keyboard_shortcut_overrides'
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: legacy
  return useMemo(
    () =>
      keyboardShortcutCommands
        .filter(({ enabled = true }) => enabled)
        .map((keyboardShortcutCommand) =>
          keyboardShortcutCommandWithOverrides(
            keyboardShortcutCommand,
            keyboardShortcutOverrides
          )
        ),
    [keyboardShortcutOverrides]
  );
};

export const useGlobalKeyboardShortcutCommands = () =>
  useOverriddenKeyboardShortcutCommands(globalKeyboardShortcutCommands);

export const useAllKeyboardShortcutCommands = () =>
  useOverriddenKeyboardShortcutCommands(keyboardShortcutCommands);

export const useLocalKeyboardShortcutCommand = (
  id: LocalKeyboardShortcutCommandId
) => {
  const [keyboardShortcutOverrides] = useSettings(
    'keyboard_shortcut_overrides'
  );

  return useMemo(
    () =>
      keyboardShortcutCommandWithOverrides(
        localKeyboardShortcutCommands[id],
        keyboardShortcutOverrides
      ),
    [id, keyboardShortcutOverrides]
  );
};
