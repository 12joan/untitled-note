declare module 'locale-includes' {
  export function localeIncludes(
    string: string,
    searchString: string,
    options?: {
      position?: number;
      locales?: string | string[];
      usage?: 'sort' | 'search';
      sensitivity?: 'base' | 'accent' | 'case' | 'variant';
    }
  ): boolean;
}
