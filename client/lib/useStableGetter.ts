import { useCallback, useLayoutEffect, useRef } from 'react';

export const useStableGetter = <T>(value: T) => {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return useCallback(() => ref.current, []);
};
