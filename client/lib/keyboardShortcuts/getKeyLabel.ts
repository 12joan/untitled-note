import { KEY_LABELS } from './constants';

export const getKeyLabel = ({ key, keyCode, code }: KeyboardEvent) => {
  // Workaround for ⌥N
  if (code === 'KeyN') return 'N';

  const keyLabel = KEY_LABELS[key];
  const fromKeyCode = String.fromCharCode(keyCode);

  if (keyLabel) return keyLabel;

  // Workaround for function key keycodes
  if (/F\d+/.test(key)) return key;

  if (/^[a-z0-9]$/i.test(fromKeyCode)) {
    return fromKeyCode.toUpperCase();
  }

  return key.toUpperCase();
};
