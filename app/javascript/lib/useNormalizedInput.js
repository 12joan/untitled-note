import { useState } from 'react'

const useNormalizedInput = (initialValue, normalize) => {
  const [value, setValue] = useState(initialValue)
  const normalizeValue = () => setValue(normalize)

  const props = {
    value,
    onChange: event => setValue(event.target.value),
    onBlur: normalizeValue,
    onKeyDown: event => event.key === 'Enter' && normalizeValue(),
  }

  return [value, props]
}

export default useNormalizedInput
