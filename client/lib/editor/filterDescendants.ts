import { TDescendant, TEditor, TElement, TNode } from '@udecode/plate';

export const filterDescendants = <T extends TEditor | TElement>(
  { children, ...restNode }: T,
  filter: (node: TNode) => boolean
): T => {
  const filteredChildren: TDescendant[] = children
    .filter(filter)
    .map((child) =>
      'children' in child ? filterDescendants(child as TElement, filter) : child
    );

  return {
    children: filteredChildren,
    ...restNode,
  } as T;
};
