import { twMerge } from 'tailwind-merge';

export type ClassNamesObject = Record<
  string,
  string | undefined | null | false
>;

export type GroupedClassNames =
  | string
  | ClassNamesObject
  | ((base: ClassNamesObject) => ClassNamesObject)
  | undefined;

const mergeGroupedClassNames = (
  base: ClassNamesObject,
  custom: GroupedClassNames
): ClassNamesObject => {
  if (!custom) {
    return base;
  }

  if (typeof custom === 'function') {
    return custom(base);
  }

  if (typeof custom === 'string') {
    return mergeGroupedClassNames(base, {
      _string: twMerge(base._string, custom),
    });
  }

  return { ...base, ...custom };
};

const resolveGroupedClassNames = (
  groupedClassNames: ClassNamesObject
): string =>
  Object.values(groupedClassNames)
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

export const groupedClassNames = (...xs: GroupedClassNames[]): string =>
  resolveGroupedClassNames(xs.reduce(mergeGroupedClassNames, {}));
