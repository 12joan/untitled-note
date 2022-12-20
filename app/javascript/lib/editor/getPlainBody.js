const rawGetPlainBody = node => {
  const { text, children } = node

  if (children !== undefined) {
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
