import { localeIncludes } from 'locale-includes';

export const includes = (haystack: string, needle: string): boolean =>
  localeIncludes(haystack, needle, {
    usage: 'search',
    sensitivity: 'base',
  });
