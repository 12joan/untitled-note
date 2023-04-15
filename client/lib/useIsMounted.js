import { useEffect, useRef } from 'react';

const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return () => isMounted.current;
};

export default useIsMounted;
