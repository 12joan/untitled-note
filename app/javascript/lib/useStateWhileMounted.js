import { useState, useRef } from 'react'

import useIsMounted from '~/lib/useIsMounted'

const useStateWhileMounted = (...args) => {
  const [state, setState] = useState(...args)
  const stateRef = useRef(state)
  const isMounted = useIsMounted()

  const setStateWhileMounted = argument => {
    if (isMounted()) {
      setState(argument)
    } else if (typeof argument === 'function') {
      argument(stateRef.current)
    }
  }

  return [state, setStateWhileMounted]
}

export default useStateWhileMounted
