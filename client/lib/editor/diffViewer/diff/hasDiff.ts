import { isElement, TDescendant } from '~/lib/editor/plate';

export const hasDiff = (descendant: TDescendant): boolean =>
  'diff' in descendant ||
  (isElement(descendant) && descendant.children.some(hasDiff));
