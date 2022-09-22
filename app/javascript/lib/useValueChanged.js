import { useRef } from 'react'

import useEffectAfterFirst from '~/lib/useEffectAfterFirst'

const useValueChanged = (value, onChange) => {
  const previousValue = useRef(value)

  useEffectAfterFirst(() => {
    onChange(previousValue.current, value)
    previousValue.current = value
  }, [value])
}

export default useValueChanged
