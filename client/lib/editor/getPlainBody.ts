import { isText, TDescendant } from '@udecode/plate';

const rawGetPlainBody = (node: TDescendant): string => {
  if (isText(node)) return node.text;

  if (node.type === 'mention') {
    return (node as any).fallbackText;
  }

  return `${node.children.map(rawGetPlainBody).join('')} `;
};

export const getPlainBody = (node: TDescendant) =>
  rawGetPlainBody(node).replace(/\s+/g, ' ').trim();
