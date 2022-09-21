import { useState } from 'react'

import useIsMounted from '~/lib/useIsMounted'

const useStateWhileMounted = (...args) => {
  const [state, setState] = useState(...args)
  const isMounted = useIsMounted()

  const setStateWhileMounted = (...args) => {
    if (isMounted()) {
      setState(...args)
    }
  }

  return [state, setStateWhileMounted]
}

export default useStateWhileMounted
