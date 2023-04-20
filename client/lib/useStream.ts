import { useLayoutEffect, useState, DependencyList } from 'react';
import { Future, pendingFuture, resolvedFuture } from '~/lib/monads';
import { Stream } from '~/lib/types';

export const useStream = <T>(
  getStream: (consumer: (data: T) => void) => Stream,
  dependencies: DependencyList
): Future<T> => {
  const [future, setFuture] = useState<Future<T>>(pendingFuture());

  useLayoutEffect(() => {
    setFuture(pendingFuture());
    const stream = getStream((data) => setFuture(resolvedFuture(data)));
    return () => stream.unsubscribe();
  }, dependencies);

  return future;
};
