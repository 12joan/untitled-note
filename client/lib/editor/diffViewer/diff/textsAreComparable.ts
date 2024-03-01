import stringComparison from 'string-comparison';

export const textsAreComparable = (text1: string, text2: string): boolean =>
  text1.trim() === '' ||
  text2.trim() === '' ||
  stringComparison.lcs.similarity(text1, text2) > 0.5;
