import { useEffect } from 'react'

import keyWithModifiers from '~/lib/keyWithModifiers'

const useKeyboardShortcut = (getElement, keys, callback, deps = []) => {
  useEffect(() => {
    const handler = event => {
      const keyList = Array.isArray(keys) ? keys : [keys]
      const key = keyWithModifiers(event)

      if (!event.defaultPrevented && keyList.includes(key)) {
        callback(event, key)
      }
    }

    const el = getElement()
    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, deps)
}

export default useKeyboardShortcut
