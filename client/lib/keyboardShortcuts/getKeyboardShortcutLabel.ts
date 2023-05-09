import { KeyboardShortcutConfig } from './types';

// TODO: Use the native shortcut format on Windows and Linux
export const getKeyboardShortcutLabel = ({
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
