import { useState, useMemo } from 'react'

const useNormalizedInput = ({ initial, normalize, validate = () => true }) => {
  const [value, setValue] = useState(initial)
  const isValid = useMemo(() => validate(value), [value])

  const normalizeValue = () => {
    const normalizedValue = normalize(value)
    setValue(isValid ? normalizedValue : initial)
  }

  const props = {
    value,
    onChange: event => setValue(event.target.value),
    onBlur: normalizeValue,
    onKeyDown: event => event.key === 'Enter' && normalizeValue(),
  }

  return [value, props, isValid]
}

export default useNormalizedInput
