const rawGetPlainBody = (node) => {
  const { type, text, children } = node;

  if (type === 'mention') {
    return node.fallbackText;
  }
  if (children !== undefined) {
    return `${children.map(rawGetPlainBody).join('')} `;
  }
  if (text !== undefined) {
    return text;
  }
  return '';
};

const getPlainBody = (node) =>
  rawGetPlainBody(node).replace(/\s+/g, ' ').trim();

export default getPlainBody;
