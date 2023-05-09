import { BaseCommand, KeyboardShortcutCommand } from '~/lib/commands';
import { KeyboardShortcutConfig } from '~/lib/settingsSchema';

export type { KeyboardShortcutConfig };

export type KeyboardShortcut = BaseCommand &
  KeyboardShortcutCommand['keyboardShortcut'];
