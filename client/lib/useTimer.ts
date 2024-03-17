import { DependencyList, useEffect } from 'react';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';

export interface UseTimerOptions {
  includeFirst?: boolean;
}

const useTimerFactory =
  (
    setTimer: (callback: () => void, delay: number) => number,
    clearTimer: (timerId: number) => void
  ) =>
  (
    callback: () => void,
    delay: number | null,
    dependencies: DependencyList = [],
    { includeFirst = true }: UseTimerOptions = {}
  ) => {
    const effectHook = includeFirst ? useEffect : useEffectAfterFirst;

    effectHook(() => {
      if (delay !== null) {
        const timer = setTimer(callback, delay);
        return () => clearTimer(timer);
      }
    }, dependencies);
  };

export const useTimeout = useTimerFactory(setTimeout, clearTimeout);
export const useInterval = useTimerFactory(setInterval, clearInterval);
