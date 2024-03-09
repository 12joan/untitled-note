import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  createEventEmitter,
  dispatchEvent,
  useEvent,
} from '~/lib/customEvents';

export type SubscribableRef<T> = {
  current: T;
  use: () => T;
};

type EventTypes = {
  change: [];
};

export const useSubscribableRef = <T>(value: T) => {
  const [eventEmitter] = useState(() => createEventEmitter<EventTypes>());

  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
    dispatchEvent(eventEmitter, 'change');
  }, [value]);

  const use = useCallback(() => {
    const [state, setState] = useState(ref.current);

    useEvent(
      eventEmitter,
      'change',
      () => {
        setState(ref.current);
      },
      []
    );

    return state;
  }, []);

  return useMemo(() => ({ ...ref, use }), []);
};
