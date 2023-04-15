import { useMemo, useState } from 'react';

const useNormalizedInput = ({ initial, normalize, validate = () => true }) => {
  const [value, setValue] = useState(initial);
  const resetValue = () => setValue(initial);

  const isValid = useMemo(() => validate(value), [value]);

  const normalizeValue = () => {
    if (isValid) {
      setValue(normalize(value));
    } else {
      resetValue();
    }
  };

  const props = {
    value,
    onChange: (event) => setValue(event.target.value),
    onBlur: normalizeValue,
    onKeyDown: (event) => event.key === 'Enter' && normalizeValue(),
  };

  return { value, props, isValid, resetValue };
};

export default useNormalizedInput;
