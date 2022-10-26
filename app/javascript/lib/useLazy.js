import { useRef } from 'react'

const useLazy = getInitialValue => {
  const ref = useRef()

  if (!ref.current) {
    ref.current = getInitialValue()
  }

  return ref.current
}

export default useLazy
