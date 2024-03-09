import { isElement, TDescendant, TElement, TNode } from '@udecode/plate';

export const filterDescendants = <T extends TElement | TDescendant[]>(
  arg: T,
  filter: (node: TNode) => boolean
): T => {
  if (isElement(arg)) {
    const { children, ...restNode } = arg;
    return {
      children: filterDescendants(children, filter),
      ...restNode,
    } as T;
  }

  const descendants: TDescendant[] = arg;

  return descendants
    .filter(filter)
    .map((child) =>
      isElement(child) ? filterDescendants(child, filter) : child
    ) as T;
};
