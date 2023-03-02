const rawGetPlainBody = node => {
  const { type, text, children } = node

  if (type === 'mention') {
    return node.fallbackText
  } else if (children !== undefined) {
    return children.map(rawGetPlainBody).join('') + ' '
  } else if (text !== undefined) {
    return text
  } else {
    return ''
  }
}

const getPlainBody = node => rawGetPlainBody(node)
  .replace(/\s+/g, ' ')
  .trim()

export default getPlainBody
