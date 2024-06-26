import { ifMac } from '~/lib/environment';

export const ALLOWED_SPECIAL_KEYS = [
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'Backspace',
  'Delete',
  'End',
  'Enter',
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'Home',
  'PageDown',
  'PageUp',
];

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
