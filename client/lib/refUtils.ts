import { RefCallback, MutableRefObject } from 'react';

type Ref<T> = RefCallback<T> | MutableRefObject<T>;

export const mergeRefs = <T>(
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

export const mapRef = <T, U>(
  upstreamRef: Ref<T>,
  map: (original: U) => T
) => (original: U) => {
  if (typeof upstreamRef === 'function') {
    upstreamRef(map(original));
  } else if (upstreamRef) {
    upstreamRef.current = map(original);
  }
};
