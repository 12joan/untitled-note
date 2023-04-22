import { useElementSize } from '~/lib/useElementSize';

export const useViewportSize = () => {
  const [size] = useElementSize(document.body);
  return size;
};
