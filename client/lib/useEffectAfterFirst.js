import { useEffect, useRef } from 'react';

const useEffectAfterFirst = (
  callback,
  dependencies = [],
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

export default useEffectAfterFirst;
