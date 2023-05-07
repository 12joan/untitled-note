import { useState, useLayoutEffect, Dispatch, SetStateAction, DependencyList, useCallback } from 'react';
import { useTimeout } from './useTimer';

export interface UseTemporaryStateOptions {
  resetAfter?: number;
  dependencies?: DependencyList;
}

export const useTemporaryState = <T>(
  initialValue: T,
  {
    resetAfter,
    dependencies = [],
  }: UseTemporaryStateOptions = {},
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  const [isClean, setIsClean] = useState(true);
  const [value, rawSetValue] = useState(initialValue);

  const setValue = useCallback((setter: SetStateAction<T>) => {
    setIsClean(false);
    rawSetValue(setter);
  }, []);

  const reset = useCallback(() => {
    if (!isClean) {
      rawSetValue(initialValue);
      setIsClean(true);
    }
  }, [initialValue, isClean]);

  useTimeout(reset, resetAfter ?? null, [resetAfter, value]);

  useLayoutEffect(reset, dependencies);

  return [value, setValue, reset];
};
