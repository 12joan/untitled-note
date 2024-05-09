import { ALLOWED_SPECIAL_KEYS } from './constants';

export const isUsableShortcut = ({ key, keyCode }: KeyboardEvent) => {
  // Allow input characters (except for space)
  if (keyCode === 32) return false;
  if (key.length === 1) return true;

  return ALLOWED_SPECIAL_KEYS.includes(key);
};
