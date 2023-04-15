import { useMemo } from 'react';
import useRecomputeOnElementResize from '~/lib/useRecomputeOnElementResize';

const useElementSize = useRecomputeOnElementResize((element) => {
  const width = element?.offsetWidth ?? 0;
  const height = element?.offsetHeight ?? 0;
  return useMemo(() => ({ width, height }), [width, height]);
});

export default useElementSize;
