import { useRef } from 'react'

import { useTimeout } from '~/lib/useTimer'

const useWaitUntilSettled = (value, handleChange, { debounceTime = 500 } = {}) => {
  const afterFirst = useRef(false)

  useTimeout(() => {
    if (!afterFirst.current) {
      afterFirst.current = true
      return
    }

    handleChange(value)
  }, debounceTime, [value])
}

export default useWaitUntilSettled
