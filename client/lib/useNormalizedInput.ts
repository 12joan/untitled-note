import { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react';

export interface UseNormalizedInputOptions {
  initial: string;
  normalize: (value: string) => string;
  validate?: (value: string) => boolean;
}

export const useNormalizedInput = ({
  initial,
  normalize,
  validate = () => true,
}: UseNormalizedInputOptions) => {
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
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    onBlur: normalizeValue,
    onKeyDown: (event: KeyboardEvent) =>
      event.key === 'Enter' && normalizeValue(),
  };

  return { value, props, isValid, resetValue };
};
