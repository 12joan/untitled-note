import { useReducer, useRef } from 'react'

import { useTimeout } from '~/lib/useTimer'

const useWaitUntilSettled = (value, handleChange, { debounceTime = 500 } = {}) => {
  const [errorCount, incrementErrorCount] = useReducer(count => count + 1, 0)
  const afterFirst = useRef(false)

  useTimeout(async () => {
    if (!afterFirst.current) {
      afterFirst.current = true
      return
    }

    const { retry = false } = await (handleChange(value) || Promise.resolve({}))

    if (retry) {
      incrementErrorCount()
    }
  }, debounceTime, [value, errorCount])
}

export default useWaitUntilSettled
