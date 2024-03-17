import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigateOrOpen = () => {
  const navigate = useNavigate();

  return useCallback(
    (path: string, newTab = false) => {
      if (newTab) {
        window.open(path, '_blank');
      } else {
        navigate(path);
      }
    },
    [navigate]
  );
};
