import { SPECIAL_KEYS } from './constants';

export const isUsableShortcut = ({
  key,
  keyCode,
  altKey,
  ctrlKey,
  metaKey,
  shiftKey,
}: KeyboardEvent) => {
  // Allow input characters (except for space)
  if (keyCode === 32) return false;
  if (key.length === 1) return true;

  const specialStatus = SPECIAL_KEYS[key];

  if (specialStatus === 'always') return true;

  if (specialStatus === 'modified') {
    return altKey || ctrlKey || metaKey || shiftKey;
  }

  return false;
};
