export const groupList = <T>(
  list: T[],
  decider: (item: T) => string
): Record<string, T[]> =>
  list.reduce((groupedItems, item) => {
    const key = decider(item);
    const group = groupedItems[key] || [];
    return { ...groupedItems, [key]: [...group, item] };
  }, {} as Record<string, T[]>);
