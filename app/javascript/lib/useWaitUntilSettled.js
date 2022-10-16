import { useReducer } from 'react'

import { useTimeout } from '~/lib/useTimer'

const useWaitUntilSettled = (value, handleChange, { debounceTime = 200 } = {}) => {
  const [errorCount, incrementErrorCount] = useReducer(count => count + 1, 0)

  useTimeout(async () => {
    const { retry = false } = await (handleChange(value) || Promise.resolve({}))

    if (retry) {
      incrementErrorCount()
    }
  }, debounceTime, [value, errorCount])
}

export default useWaitUntilSettled
