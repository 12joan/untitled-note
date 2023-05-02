import { KeyboardShortcut } from '~/lib/settingsSchema';

export type { KeyboardShortcut };

const SPECIAL_KEYS: Record<string, 'always' | 'modified'> = {
  ArrowDown: 'modified',
  ArrowLeft: 'modified',
  ArrowRight: 'modified',
  ArrowUp: 'modified',
  Backspace: 'modified',
  Delete: 'always',
  End: 'modified',
  Enter: 'modified',
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
  '_': '-',
  '+': '=',
  '{': '[',
  '}': ']',
  ':': ';',
  '"': '\'',
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
}: KeyboardShortcut) => {
  const parts: string[] = [];

  if (ctrlKey) parts.push('^');
  if (shiftKey) parts.push('⇧');
  if (altKey) parts.push('⌥');
  if (metaKey) parts.push('⌘');

  parts.push(keyLabel);

  return parts.join('');
};

export const isKeyboardShortcut = (
  shortcut: KeyboardShortcut,
  event: KeyboardEvent
) => (
  event.key === shortcut.key &&
    event.altKey === !!shortcut.altKey &&
    event.ctrlKey === !!shortcut.ctrlKey &&
    event.metaKey === !!shortcut.metaKey &&
    event.shiftKey === !!shortcut.shiftKey
);
