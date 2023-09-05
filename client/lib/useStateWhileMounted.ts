import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { useIsMounted } from '~/lib/useIsMounted';

export const useStateWhileMounted = <T>(initialState: T | (() => T)) => {
  const [state, setState] = useState<T>(initialState);
  const stateRef = useRef(state);
  const isMounted = useIsMounted();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const setStateWhileMounted = (argument: SetStateAction<T>) => {
    if (isMounted()) {
      setState(argument);
    } else if (typeof argument === 'function') {
      /**
       * The setter function may have side effects. Call it anyway and discard
       * the result.
       */
      (argument as (state: T) => T)(stateRef.current!);
    }
  };

  return [state, setStateWhileMounted] as [T, Dispatch<SetStateAction<T>>];
};
