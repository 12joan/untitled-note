import { IS_APPLE } from '~/lib/environment';
import { KeyboardShortcutConfig } from '~/lib/types';

export const parseKeyboardShortcut = (
  string: string,
  overrides: Partial<KeyboardShortcutConfig> = {}
): KeyboardShortcutConfig => {
  const parts = string.split('+');
  const hasPart = (part: string) => parts.includes(part);

  return {
    key: parts[parts.length - 1],
    altKey: hasPart('alt'),
    ctrlKey: hasPart('ctrl') || (!IS_APPLE && hasPart('mod')),
    metaKey: hasPart('meta') || (IS_APPLE && hasPart('mod')),
    shiftKey: hasPart('shift'),
    ...overrides,
  };
};
