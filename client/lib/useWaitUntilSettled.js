import { useRef } from 'react';
import { useTimeout } from '~/lib/useTimer';

const useWaitUntilSettled = (
  value,
  handleChange,
  { debounceTime = 500 } = {}
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

export default useWaitUntilSettled;
