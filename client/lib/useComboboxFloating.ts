import {
  autoPlacement,
  autoUpdate,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import { mergeRefs } from '~/lib/refUtils';
import { useElementSize } from '~/lib/useElementSize';

export interface UseComboboxFloatingOptions {
  flip?: boolean;
  padding?: number;
  constrainWidth?: boolean;
}

export const useComboboxFloating = ({
  flip: shouldFlip = false,
  padding = 10,
  constrainWidth = false,
}: UseComboboxFloatingOptions = {}) => {
  const [{ width: inputWidth }, sizeRef] = useElementSize();

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
    whileElementsMounted: autoUpdate,
  });

  const suggestionsProps = {
    ref: suggestionsRef,
    style: {
      position: suggestionsPosition,
      top: suggestionsY ?? 0,
      left: suggestionsX ?? 0,
      maxWidth: constrainWidth ? inputWidth : undefined,
    },
  };

  const inputProps = { ref: mergeRefs([inputRef, sizeRef as any]) };

  return { suggestionsProps, inputProps };
};
