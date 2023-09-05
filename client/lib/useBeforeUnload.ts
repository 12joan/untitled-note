import { useEffect } from 'react';

export const useBeforeUnload = (isActive: boolean) => {
  useEffect(() => {
    if (isActive) {
      const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = '';
      };

      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () =>
        window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
  }, [isActive]);
};
