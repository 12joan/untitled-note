import { substr } from 'runes';

export const abbreviate = (text: string, maxLength: number): string =>
  text
    .split(' ')
    .filter((word) => word.length > 0)
    .slice(0, maxLength)
    .map((word) => substr(word, 0, 1).toUpperCase())
    .join('');
