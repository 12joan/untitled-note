import { useRef } from 'react';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';

export const useValueChanged = <T>(
  value: T,
  onChange: (previousValue: T, value: T) => void
) => {
  const previousValue = useRef(value);

  useEffectAfterFirst(() => {
    onChange(previousValue.current, value);
    previousValue.current = value;
  }, [value]);
};
