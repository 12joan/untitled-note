import { useEffect, useRef } from 'react'

const useEffectAfterFirst = (callback, dependencies = []) => {
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
    } else {
      return callback()
    }
  }, dependencies)
}

export default useEffectAfterFirst
