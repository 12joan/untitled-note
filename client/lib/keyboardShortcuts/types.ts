import { KeyboardShortcutConfig } from '~/lib/settingsSchema';
import {
  BaseCommand,
  KeyboardShortcutCommand,
} from '~/lib/commands';

export type { KeyboardShortcutConfig };

export type KeyboardShortcut = BaseCommand &
  KeyboardShortcutCommand['keyboardShortcut'];
