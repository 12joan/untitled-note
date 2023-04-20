import { RefCallback, MutableRefObject } from 'react';

type Ref<T> = RefCallback<T> | MutableRefObject<T>;

export const multiplexRefs = <T>(
  upstreamRefs: (Ref<T> | undefined)[]
) => (current: T) => {
  upstreamRefs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(current);
    } else if (ref) {
      ref.current = current;
    }
  });
};
