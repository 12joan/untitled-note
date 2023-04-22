export const pluralize = (
  count: number,
  singular: string,
  plural?: string,
  zero?: string
) => {
  if (count === 0 && zero) {
    return zero;
  }

  if (count === 1) {
    return `${count} ${singular}`;
  }

  const noun = plural || `${singular}s`;
  return `${count} ${noun}`;
};
