export const mapWithBeforeAndAfter = <T, U>(
  items: T[],
  fn: (item: T, before: T | null, after: T | null) => U
): U[] => {
  return items.map((item, i) => {
    const before = i > 0 ? items[i - 1] : null;
    const after = i < items.length - 1 ? items[i + 1] : null;
    return fn(item, before, after);
  });
};
