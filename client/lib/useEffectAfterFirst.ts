import { useEffect, useRef } from 'react';

export const useEffectAfterFirst = (
  callback: () => void,
  dependencies: React.DependencyList = [],
  shouldExecute = true
) => {
  const isFirst = useRef(true);

  useEffect(() => {
    if (shouldExecute) {
      if (isFirst.current) {
        isFirst.current = false;
      } else {
        return callback();
      }
    }
  }, dependencies);
};
