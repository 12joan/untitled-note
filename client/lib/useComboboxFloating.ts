import {
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';

export const useComboboxFloating = ({
  flip: shouldFlip = false,
  autoUpdate: shouldAutoUpdate = false,
  padding = 10,
} = {}) => {
  const {
    x: suggestionsX,
    y: suggestionsY,
    reference: inputRef,
    floating: suggestionsRef,
    strategy: suggestionsPosition,
  } = useFloating({
    middleware: [
      shouldFlip &&
        autoPlacement({
          allowedPlacements: ['top-start', 'bottom-start'],
        }),
      offset(padding),
      shift({
        padding,
      }),
      size({
        apply: ({ availableHeight, elements }) => {
          elements.floating.style.maxHeight = `${availableHeight}px`;
        },
        padding,
      }),
    ],
    whileElementsMounted: shouldAutoUpdate ? autoUpdate : undefined,
  });

  const suggestionsProps = {
    ref: suggestionsRef,
    style: {
      position: suggestionsPosition,
      top: suggestionsY ?? 0,
      left: suggestionsX ?? 0,
    },
  };

  const inputProps = { ref: inputRef };

  return { suggestionsProps, inputProps };
};
