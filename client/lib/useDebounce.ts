import { DependencyList, useCallback, useRef } from 'react';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';

export const useDebounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
  deps: DependencyList
) => {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestArgs = useRef<T | null>(null);
  const [isDirty, setIsDirty] = useStateWhileMounted(false);

  const debouncedFunction = useCallback((...args: T) => {
    latestArgs.current = args;

    if (timeout.current === null) {
      setIsDirty(true);

      timeout.current = setTimeout(() => {
        callback(...latestArgs.current!);
        timeout.current = null;
        setIsDirty(false);
      }, delay);
    }
  }, deps);

  return [debouncedFunction, isDirty] as const;
};
