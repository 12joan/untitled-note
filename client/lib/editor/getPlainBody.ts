import { TNode } from '@udecode/plate';

const rawGetPlainBody = (node: TNode): string => {
  const { type, text, children } = node;

  if (type === 'mention') {
    return (node as any).fallbackText;
  }

  if (Array.isArray(children)) {
    return `${children.map(rawGetPlainBody).join('')} `;
  }

  if (typeof text === 'string') {
    return text;
  }

  return '';
};

export const getPlainBody = (node: TNode) =>
  rawGetPlainBody(node).replace(/\s+/g, ' ').trim();
