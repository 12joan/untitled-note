const keyWithModifiers = event => {
  const meta = event.ctrlKey || event.metaKey
  const shift = event.shiftKey
  const alt = event.altKey
  return `${meta ? 'Meta' : ''}${shift ? 'Shift' : ''}${alt ? 'Alt' : ''}${event.key}`
}

export default keyWithModifiers
