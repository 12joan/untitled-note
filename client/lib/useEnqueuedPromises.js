import { useRef } from 'react';
import retry from '~/lib/retry';
import useStateWhileMounted from '~/lib/useStateWhileMounted';

const useEnqueuedPromises = () => {
  const inflightPromise = useRef(null);
  const enqueuedPromiseProvider = useRef(null);
  const [isDirty, setIsDirty] = useStateWhileMounted(false);

  const initiatePromise = (promiseProvider) => {
    setIsDirty(true);

    inflightPromise.current = retry(promiseProvider, {
      maxRetries: Infinity,
      interval: 3000,
      shouldRetry: () => {
        return enqueuedPromiseProvider.current === null;
      },
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
  };

  const enqueuePromise = (promiseProvider) => {
    if (inflightPromise.current === null) {
      initiatePromise(promiseProvider);
    } else {
      enqueuedPromiseProvider.current = promiseProvider;
    }
  };

  return [enqueuePromise, isDirty];
};

export default useEnqueuedPromises;
