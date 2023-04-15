const mergeGroupedClassNames = (base, custom) => {
  if (!custom) {
    return base;
  }
  if (typeof custom === 'function') {
    return custom(base);
  }
  return { ...base, ...custom };
};

const resolveGroupedClassNames = (groupedClassNames) =>
  Object.values(groupedClassNames)
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

const groupedClassNames = (base, ...overrides) =>
  resolveGroupedClassNames(overrides.reduce(mergeGroupedClassNames, base));

export default groupedClassNames;
