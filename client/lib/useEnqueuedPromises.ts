import { useCallback, useRef } from 'react';
import { retry } from '~/lib/retry';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';

export const useEnqueuedPromises = () => {
  type TPromise = Promise<void>;
  type TPromiseFn = () => TPromise;

  const inflightPromise = useRef<TPromise | null>(null);
  const enqueuedPromiseProvider = useRef<TPromiseFn | null>(null);
  const [isDirty, setIsDirty] = useStateWhileMounted(false);
  const [isFailing, setIsFailing] = useStateWhileMounted(false);

  const initiatePromise = useCallback((promiseProvider: TPromiseFn) => {
    setIsDirty(true);

    inflightPromise.current = retry(promiseProvider, {
      maxRetries: Infinity,
      interval: 3000,
      shouldRetry: () => enqueuedPromiseProvider.current === null,
      setIsFailing,
    })
      .then(() => {
        if (enqueuedPromiseProvider.current === null) {
          setIsDirty(false);
        }
      })
      .finally(() => {
        if (enqueuedPromiseProvider.current !== null) {
          initiatePromise(enqueuedPromiseProvider.current);
          enqueuedPromiseProvider.current = null;
        } else {
          inflightPromise.current = null;
        }
      });
  }, []);

  const enqueuePromise = useCallback(
    (promiseProvider: TPromiseFn) => {
      if (inflightPromise.current === null) {
        initiatePromise(promiseProvider);
      } else {
        enqueuedPromiseProvider.current = promiseProvider;
      }
    },
    [initiatePromise]
  );

  return {
    enqueuePromise,
    isDirty,
    isFailing,
  };
};
