import { ifMac } from '~/lib/environment';

export const SPECIAL_KEYS: Record<string, 'always' | 'modified'> = {
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

export const MODIFIER_LABELS = {
  alt: ifMac('⌥', 'Alt+'),
  ctrl: ifMac('⌃', 'Ctrl+'),
  meta: ifMac('⌘', 'Meta+'),
  shift: ifMac('⇧', 'Shift+'),
};

export const KEY_LABELS: Record<string, string> = {
  ArrowDown: ifMac('↓', 'Down'),
  ArrowLeft: ifMac('←', 'Left'),
  ArrowRight: ifMac('→', 'Right'),
  ArrowUp: ifMac('↑', 'Up'),
  Backspace: ifMac('⌫', 'Backspace'),
  Delete: ifMac('⌦', 'Delete'),
  End: ifMac('↘', 'End'),
  Enter: ifMac('↵', 'Enter'),
  Home: ifMac('↖', 'Home'),
  PageDown: ifMac('⇟', 'Page Down'),
  PageUp: ifMac('⇞', 'Page Up'),
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
