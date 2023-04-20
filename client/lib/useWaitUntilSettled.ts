import { useRef } from 'react';
import { useTimeout } from '~/lib/useTimer';

export const useWaitUntilSettled = <T>(
  value: T,
  handleChange: (value: T) => void,
  {
    debounceTime = 500,
  }: {
    debounceTime?: number;
  } = {}
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
