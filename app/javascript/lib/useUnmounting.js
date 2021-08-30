import { useRef, useEffect } from 'react'

const useUnmounting = () => {
  const unmounting = useRef(false)

  useEffect(() => () => {
    unmounting.current = true
  }, [])

  return unmounting
}

export default useUnmounting
