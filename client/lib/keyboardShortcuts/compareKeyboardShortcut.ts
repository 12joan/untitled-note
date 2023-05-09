import { KeyboardShortcutConfig } from './types';

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
