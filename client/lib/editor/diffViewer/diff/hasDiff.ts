import { isElement, TDescendant } from '@udecode/plate';

export const hasDiff = (descendant: TDescendant): boolean =>
  'diff' in descendant ||
  (isElement(descendant) && descendant.children.some(hasDiff));
