import { useRef, useEffect } from 'react'

const useIsMounted = () => {
  const isMounted = useRef(true)

  useEffect(() => () => {
    isMounted.current = false
  }, [])

  return () => isMounted.current
}

export default useIsMounted
