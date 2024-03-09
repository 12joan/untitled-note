import { BaseCommand, KeyboardShortcutCommand } from '~/lib/commands';
import { KeyboardShortcutConfig } from '~/lib/types';

export type { KeyboardShortcutConfig };

export type KeyboardShortcut = BaseCommand &
  KeyboardShortcutCommand['keyboardShortcut'];
