const keyWithModifiers = event => {
  const meta = Boolean(event.ctrlKey ^ event.metaKey)
  const shift = event.shiftKey
  const alt = event.altKey
  const [c, ...cs] = event.key
  const capitalisedKey = c.toUpperCase() + cs.join('')
  return `${meta ? 'Meta' : ''}${shift ? 'Shift' : ''}${alt ? 'Alt' : ''}${capitalisedKey}`
}

export default keyWithModifiers
