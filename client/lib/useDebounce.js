import { useRef } from 'react'

import useStateWhileMounted from '~/lib/useStateWhileMounted'

const useDebounce = (callback, delay) => {
  const timeout = useRef(null)
  const latestArgs = useRef(null)
  const [isDirty, setIsDirty] = useStateWhileMounted(false)

  const debouncedFunction = (...args) => {
    latestArgs.current = args

    if (timeout.current === null) {
      setIsDirty(true)

      timeout.current = setTimeout(() => {
        callback(...latestArgs.current)
        timeout.current = null
        setIsDirty(false)
      }, delay)
    }
  }

  return [debouncedFunction, isDirty]
}

export default useDebounce
