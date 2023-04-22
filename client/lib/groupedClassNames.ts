export type ClassNamesObject = Record<
  string,
  string | undefined | null | false
>;

export type GroupedClassNames =
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
