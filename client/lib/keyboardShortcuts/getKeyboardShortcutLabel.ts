import { KeyboardShortcutConfig } from '~/lib/types';
import { MODIFIER_LABELS } from './constants';

export const getKeyboardShortcutLabel = ({
  key,
  keyLabel = key.toUpperCase(),
  altKey = false,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
}: KeyboardShortcutConfig) => {
  const parts: string[] = [];

  if (ctrlKey) parts.push(MODIFIER_LABELS.ctrl);
  if (altKey) parts.push(MODIFIER_LABELS.alt);
  if (shiftKey) parts.push(MODIFIER_LABELS.shift);
  if (metaKey) parts.push(MODIFIER_LABELS.meta);

  parts.push(keyLabel);

  return parts.join('');
};
