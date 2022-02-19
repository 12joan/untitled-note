const modifierKey = /mac/i.test(navigator.userAgent)
  ? { symbol: '⌘', label: 'command' }
  : { symbol: '^', label: 'ctrl' }

export default modifierKey
