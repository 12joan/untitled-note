import { useEffect } from 'react'

import keyWithModifiers from '~/lib/keyWithModifiers'
import useKeyboardShortcut from '~/lib/useKeyboardShortcut'

const useGlobalKeyboardShortcut = (...args) => {
  useKeyboardShortcut(() => document, ...args)
}

export default useGlobalKeyboardShortcut
