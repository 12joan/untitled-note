import { useRef } from 'react';
import { useTimeout } from '~/lib/useTimer';

export interface UseWaitUntilSettledOptions {
  debounceTime?: number;
}

export const useWaitUntilSettled = <T>(
  value: T,
  handleChange: (value: T) => void,
  { debounceTime = 500 }: UseWaitUntilSettledOptions = {}
) => {
  const afterFirst = useRef(false);
  const initialValue = useRef(value);

  useTimeout(
    () => {
      if (!afterFirst.current) {
        afterFirst.current = true;
        if (value === initialValue.current) return;
      }

      handleChange(value);
    },
    debounceTime,
    [value]
  );
};
