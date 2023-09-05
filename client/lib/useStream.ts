import { DependencyList, useLayoutEffect, useState } from 'react';
import { Future, pendingFuture, resolvedFuture } from '~/lib/monads';
import { streamCache } from '~/lib/streamCacheAdapter';
import { Stream } from '~/lib/types';

export type UseStreamOptions<T> = {
  getStream: (consumer: (data: T) => void) => Stream;
  cacheKey?: string;
  disableCacheLoad?: boolean;
};

export const useStream = <T>(
  { getStream, cacheKey, disableCacheLoad = false }: UseStreamOptions<T>,
  dependencies: DependencyList
): Future<T> => {
  const [future, setFuture] = useState<Future<T>>(pendingFuture());

  useLayoutEffect(() => {
    setFuture(pendingFuture());

    let cacheLoadCancelled = false;

    if (cacheKey && !disableCacheLoad) {
      streamCache.getItem(cacheKey).then((data) => {
        if (!cacheLoadCancelled && data) {
          // eslint-disable-next-line no-console
          console.debug(`Loaded ${cacheKey} from cache`);
          setFuture(resolvedFuture(JSON.parse(data)));
        }
      });
    }

    const stream = getStream((data) => {
      setFuture(resolvedFuture(data));

      if (cacheKey) {
        cacheLoadCancelled = true;
        streamCache.setItem(cacheKey, JSON.stringify(data));
      }
    });

    return () => {
      cacheLoadCancelled = true;
      stream.unsubscribe();
    };
  }, dependencies);

  return future;
};
