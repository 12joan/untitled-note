/** biome-ignore-all lint/correctness/useHookAtTopLevel: hook factory */
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  createEventEmitter,
  dispatchEvent,
  useEvent,
} from '~/lib/customEvents';

export interface SubscribableRef<T> {
  current: T;
  use: () => T;
}

// biome-ignore lint/style/useConsistentTypeDefinitions: cannot use interface
type EventTypes = {
  change: [];
};

export const useSubscribableRef = <T>(value: T) => {
  const [eventEmitter] = useState(() => createEventEmitter<EventTypes>());

  const ref = useRef(value);

  // biome-ignore lint/correctness/useExhaustiveDependencies: legacy
  useLayoutEffect(() => {
    ref.current = value;
    dispatchEvent(eventEmitter, 'change');
  }, [value]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: legacy
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: legacy
  return useMemo(() => ({ ...ref, use }), []);
};
