import { DependencyList, useEffect } from 'react';

const useTimerFactory =
  (
    setTimer: (callback: () => void, delay: number) => number,
    clearTimer: (timerId: number) => void
  ) =>
  (
    callback: () => void,
    delay: number | null,
    dependencies: DependencyList = []
  ) => {
    useEffect(() => {
      if (delay !== null) {
        const timer = setTimer(callback, delay);
        return () => clearTimer(timer);
      }
    }, dependencies);
  };

export const useTimeout = useTimerFactory(setTimeout, clearTimeout);
export const useInterval = useTimerFactory(setInterval, clearInterval);
