import { useCallback, useEffect, useRef } from 'react';
import { useStableGetter } from '~/lib/useStableGetter';
import { useTimeout } from '~/lib/useTimer';

export interface UseWaitUntilSettledOptions {
  debounceTime?: number;
  fireOnUnmount?: boolean;
}

export const useWaitUntilSettled = <T>(
  value: T,
  handleChange: (value: T) => void,
  { debounceTime = 500, fireOnUnmount = false }: UseWaitUntilSettledOptions = {}
) => {
  const getCurrentValue = useStableGetter(value);
  const previousValue = useRef(value);
  const getHandleChange = useStableGetter(handleChange);

  const fireIfChanged = useCallback(() => {
    const currentValue = getCurrentValue();
    if (currentValue !== previousValue.current) {
      previousValue.current = currentValue;
      getHandleChange()(currentValue);
    }
  }, []);

  useTimeout(fireIfChanged, debounceTime, [value]);

  useEffect(
    () => () => {
      if (fireOnUnmount) {
        fireIfChanged();
      }
    },
    []
  );
};
