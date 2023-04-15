import { offset, shift, size, useFloating } from '@floating-ui/react-dom';

const useComboboxFloating = ({ allowOverflow = false } = {}) => {
  const {
    x: suggestionsX,
    y: suggestionsY,
    reference: inputRef,
    floating: suggestionsRef,
    strategy: suggestionsPosition,
  } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(10),
      shift(),
      size({
        apply: ({ availableHeight, elements }) => {
          if (!allowOverflow) {
            elements.floating.style.maxHeight = `${availableHeight}px`;
          }
        },
        padding: 10,
      }),
    ],
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

export default useComboboxFloating;
