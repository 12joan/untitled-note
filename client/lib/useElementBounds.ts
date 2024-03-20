import { useRecomputeOnElementResize } from '~/lib/useRecomputeOnElementResize';

export const useElementBounds = useRecomputeOnElementResize((element) => {
  const {
    top = 0,
    right = 0,
    bottom = 0,
    left = 0,
    width = 0,
    height = 0,
  } = element?.getBoundingClientRect() ?? {};

  /**
   * When the iOS keyboard is open, fixed and non-fixed elements may be
   * translated up, which is reflected in their bounding rect. This causes the
   * main element in ProjectView to overlap the top bar if ProjectView
   * re-renders while the keyboard is open.
   *
   * To mitigate this, we get the bounding rect of a fixed element in the
   * top-left corner of the viewport and subtract its x and y values from the
   * bounding rect of the observed element.
   */
  const cornerRef = document.createElement('div');
  cornerRef.style.position = 'fixed';
  cornerRef.style.top = '0';
  cornerRef.style.left = '0';
  document.body.appendChild(cornerRef);
  const { x: cornerX, y: cornerY } = cornerRef.getBoundingClientRect();
  document.body.removeChild(cornerRef);

  return {
    top: top - cornerY,
    right: right - cornerX,
    bottom: bottom - cornerY,
    left: left - cornerX,
    width,
    height,
  };
});
