import { useMemo } from 'react';
import { useSettings } from '~/lib/settings';
import { KeyboardShortcutConfig } from '~/lib/settingsSchema';
import { KeyboardShortcut } from '~/lib/types';

export type { KeyboardShortcutConfig };

const getSequential = (event: KeyboardEvent) =>
  parseInt(event.code.replace('Digit', ''), 10);

// TODO: Change default configs based on platform and browser
const keyboardShortcuts: KeyboardShortcut[] = [
  {
    id: 'search',
    label: 'Search',
    hint: 'Search project',
    config: {
      key: 'k',
      metaKey: true,
    },
    action: ({ toggleSearchModal }) => toggleSearchModal(),
  },
  {
    id: 'new-document',
    label: 'New document',
    hint: 'Create new document',
    config: {
      key: 'n',
      metaKey: true,
      shiftKey: true,
    },
    action: ({ createNewDocument }) => createNewDocument(),
  },
  {
    id: 'switch-project',
    label: 'Switch to project 1',
    hint: 'Shortcuts for projects 2-9 are automatically generated',
    sequential: true,
    config: {
      key: '1',
      metaKey: true,
    },
    action: ({ switchProject }, event) => switchProject(getSequential(event)),
  },
  {
    id: 'cycle-focus',
    label: 'Cycle focus',
    hint: 'Cycle focus between the main sections of the interface',
    config: {
      key: 'F6',
      altKey: true,
    },
    action: ({ cycleFocus }) => cycleFocus(),
  },
];

export const useKeyboardShortcuts = (): KeyboardShortcut[] => {
  const [keyboardShortcutOverrides] = useSettings('keyboardShortcutOverrides');

  return useMemo(
    () =>
      keyboardShortcuts.map((keyboardShortcut) => ({
        ...keyboardShortcut,
        config: (
          keyboardShortcut.id in keyboardShortcutOverrides
            ? keyboardShortcutOverrides[keyboardShortcut.id]
            : keyboardShortcut.config
        ) ?? undefined,
      })),
    [keyboardShortcutOverrides]
  );
};

const SPECIAL_KEYS: Record<string, 'always' | 'modified'> = {
  ArrowDown: 'modified',
  ArrowLeft: 'modified',
  ArrowRight: 'modified',
  ArrowUp: 'modified',
  Backspace: 'modified',
  Delete: 'always',
  End: 'modified',
  Enter: 'modified',
  F1: 'always',
  F2: 'always',
  F3: 'always',
  F4: 'always',
  F5: 'always',
  F6: 'always',
  F7: 'always',
  F8: 'always',
  F9: 'always',
  F10: 'always',
  F11: 'always',
  F12: 'always',
  Home: 'modified',
  PageDown: 'modified',
  PageUp: 'modified',
};

const KEY_LABELS: Record<string, string> = {
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  Backspace: '⌫',
  Delete: '⌦',
  End: '↘',
  Enter: '↵',
  Home: '↖',
  PageDown: '⇟',
  PageUp: '⇞',
  _: '-',
  '+': '=',
  '{': '[',
  '}': ']',
  ':': ';',
  '"': "'",
  '|': '\\',
  '<': ',',
  '>': '.',
  '?': '/',
  '~': '`',
};

export const isUsableShortcut = ({
  key,
  keyCode,
  altKey,
  ctrlKey,
  metaKey,
  shiftKey,
}: KeyboardEvent) => {
  // Allow input characters (except for space)
  if (keyCode === 32) return false;
  if (key.length === 1) return true;

  const specialStatus = SPECIAL_KEYS[key];

  if (specialStatus === 'always') return true;

  if (specialStatus === 'modified') {
    return altKey || ctrlKey || metaKey || shiftKey;
  }

  return false;
};

export const getKeyLabel = ({ key, keyCode }: KeyboardEvent) => {
  const keyLabel = KEY_LABELS[key];
  const fromKeyCode = String.fromCharCode(keyCode);

  if (keyLabel) return keyLabel;

  // Workaround for function key keycodes
  if (/F\d+/.test(key)) return key;

  if (/^[a-z0-9]$/i.test(fromKeyCode)) {
    return fromKeyCode.toUpperCase();
  }

  return key.toUpperCase();
};

// TODO: Use the native shortcut format on Windows and Linux
export const getShortcutLabel = ({
  key,
  keyLabel = key.toUpperCase(),
  altKey = false,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
}: KeyboardShortcutConfig) => {
  const parts: string[] = [];

  if (ctrlKey) parts.push('^');
  if (altKey) parts.push('⌥');
  if (shiftKey) parts.push('⇧');
  if (metaKey) parts.push('⌘');

  parts.push(keyLabel);

  return parts.join('');
};

export const compareKeyboardShortcut = (
  shortcut: KeyboardShortcutConfig,
  event: KeyboardEvent,
  sequential = false
) => {
  const matchesKey = event.key === shortcut.key;
  const matchesSequential = sequential && /Digit[^0]/.test(event.code);

  return (
    (matchesKey || matchesSequential) &&
    event.altKey === !!shortcut.altKey &&
    event.ctrlKey === !!shortcut.ctrlKey &&
    event.metaKey === !!shortcut.metaKey &&
    event.shiftKey === !!shortcut.shiftKey
  );
};
