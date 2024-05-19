import { KeyboardShortcutConfig } from '~/lib/types';

export const compareKeyboardShortcut = (
  shortcut: KeyboardShortcutConfig,
  event: KeyboardEvent,
  sequential = false
) => {
  const matchesKey: boolean = (() => {
    if (shortcut.customComparison) {
      return (
        event[shortcut.customComparison.property] ===
        shortcut.customComparison.value
      );
    }

    return event.key.toLowerCase() === shortcut.key.toLowerCase();
  })();

  const matchesSequential = sequential && /Digit[^0]/.test(event.code);

  return (
    (matchesKey || matchesSequential) &&
    event.altKey === !!shortcut.altKey &&
    event.ctrlKey === !!shortcut.ctrlKey &&
    event.metaKey === !!shortcut.metaKey &&
    event.shiftKey === !!shortcut.shiftKey
  );
};
