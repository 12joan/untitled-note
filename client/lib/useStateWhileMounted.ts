import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useIsMounted } from '~/lib/useIsMounted';

export const useStateWhileMounted = <T>(initialState: T | (() => T)) => {
  const [state, setState] = useState<T>(initialState);
  const stateRef = useRef(state);
  const isMounted = useIsMounted();

  const setStateWhileMounted = (argument: SetStateAction<T>) => {
    if (isMounted()) {
      setState(argument as T);
      stateRef.current = argument as T;
    } else if (typeof argument === 'function') {
      (argument as (state: T) => T)(stateRef.current!);
    }
  };

  return [state, setStateWhileMounted] as [T, Dispatch<SetStateAction<T>>];
};
