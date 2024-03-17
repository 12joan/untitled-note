import { useCallback, useEffect, useRef } from 'react';
import { useStableGetter } from '~/lib/useStableGetter';
import { useTimeout } from '~/lib/useTimer';

export interface UseWaitUntilSettledOptions {
  debounceTime?: number;
  fireEvenIfUnchanged?: boolean;
  fireOnMount?: boolean;
  fireOnUnmount?: boolean;
}

export const useWaitUntilSettled = <T>(
  value: T,
  handleChange: (value: T) => void,
  {
    debounceTime = 500,
    fireEvenIfUnchanged = false,
    fireOnMount = false,
    fireOnUnmount = false,
  }: UseWaitUntilSettledOptions = {}
) => {
  const getCurrentValue = useStableGetter(value);
  const previousValue = useRef(value);
  const getHandleChange = useStableGetter(handleChange);

  const maybeFire = useCallback(() => {
    const currentValue = getCurrentValue();
    if (fireEvenIfUnchanged || currentValue !== previousValue.current) {
      previousValue.current = currentValue;
      getHandleChange()(currentValue);
    }
  }, [fireEvenIfUnchanged]);

  useTimeout(maybeFire, debounceTime, [value], { includeFirst: false });

  useEffect(() => {
    if (fireOnMount) {
      getHandleChange()(value);
    }

    return () => {
      if (fireOnUnmount) {
        maybeFire();
      }
    };
  }, []);
};
