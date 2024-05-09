import {
  HTMLProps,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useMemo,
  useState,
} from 'react';
import { isHotkey } from '@udecode/plate';
import { positiveMod } from '~/lib/positiveMod';

export interface UseComboboxOptions<T> {
  query: string;
  suggestions: T[];
  keyForSuggestion: (suggestion: T) => string;
  onCommit: (suggestion: T, altBehaviour: boolean) => void;
  completeOnTab?: boolean;
  hideOnBlur?: boolean;
  hideWhenNoSuggestions?: boolean;
  hideWhenEmptyQuery?: boolean;
}

type RenderSuggestionOptions<T> = {
  suggestion: T;
  active: boolean;
  suggestionProps: HTMLProps<HTMLDivElement>;
};

type UseComboboxResult<T> = {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  showSuggestions: boolean;
  suggestionContainerProps: HTMLProps<HTMLDivElement>;
  mapSuggestions: (
    renderSuggestion: (options: RenderSuggestionOptions<T>) => ReactNode
  ) => ReactNode;
};

export const useCombobox = <T>({
  query,
  suggestions,
  keyForSuggestion,
  onCommit,
  completeOnTab = false,
  hideOnBlur = false,
  hideWhenNoSuggestions = true,
  hideWhenEmptyQuery = true,
}: UseComboboxOptions<T>): UseComboboxResult<T> => {
  const idPrefix = useMemo(
    () => `combobox-${Math.random().toString(36).slice(2)}-`,
    []
  );
  const idForSuggestion = (key: string) => `${idPrefix}${key}`;

  const [inputFocused, setInputFocused] = useState(false);

  const showSuggestions =
    (!hideOnBlur || inputFocused) &&
    (!hideWhenEmptyQuery || query.length > 0) &&
    (!hideWhenNoSuggestions || suggestions.length > 0);

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const activeSuggestion = suggestions[activeSuggestionIndex];
  const activeSuggestionKey =
    activeSuggestion && keyForSuggestion(activeSuggestion);

  const selectFirstSuggestion = () => setActiveSuggestionIndex(0);

  const handleMouseOverSuggestion = (index: number) => () =>
    setActiveSuggestionIndex(index);

  const isAltBehaviour = (event: KeyboardEvent | MouseEvent) =>
    event.ctrlKey || event.metaKey;

  const handleClickSuggestion = (index: number) => (event: MouseEvent) =>
    onCommit(suggestions[index], isAltBehaviour(event));

  const handleKeyDown = (event: KeyboardEvent) => {
    const step = (delta: number) => {
      const newIndex = positiveMod(
        activeSuggestionIndex + delta,
        suggestions.length
      );

      setActiveSuggestionIndex(newIndex);

      // Scroll new suggestion into view
      const newSuggestion = suggestions[newIndex];
      const newSuggestionKey = newSuggestion && keyForSuggestion(newSuggestion);

      if (newSuggestionKey) {
        const newSuggestionElement = document.getElementById(
          idForSuggestion(newSuggestionKey)
        );
        newSuggestionElement?.scrollIntoView({ block: 'nearest' });
      }
    };

    if (showSuggestions) {
      if (isHotkey('up', event)) {
        event.preventDefault();
        step(-1);
      }

      if (isHotkey('down', event)) {
        event.preventDefault();
        step(1);
      }

      if (isHotkey('mod?+enter', event)) {
        event.preventDefault();
        onCommit(activeSuggestion, isAltBehaviour(event));
      }

      if (isHotkey('tab', event)) {
        event.preventDefault();

        if (completeOnTab) {
          onCommit(activeSuggestion, false);
        } else {
          step(1);
        }
      }

      if (isHotkey('shift+tab', event) && !completeOnTab) {
        event.preventDefault();
        step(-1);
      }
    }
  };

  return {
    inputProps: {
      onChange: () => selectFirstSuggestion(),
      onKeyDown: handleKeyDown,
      onFocus: () => setInputFocused(true),
      onBlur: () => setInputFocused(false),
      role: 'combobox',
      'aria-expanded': showSuggestions,
    },

    showSuggestions,

    suggestionContainerProps: {
      role: 'listbox',
      'aria-activedescendant': idForSuggestion(activeSuggestionKey),
      // Prevent blur when clicking scrollbar
      onMouseDown: (event) => event.preventDefault(),
    },

    mapSuggestions: (renderSuggestion) =>
      suggestions.map((suggestion, index) => {
        const key = keyForSuggestion(suggestion);
        const active = key === activeSuggestionKey;

        return renderSuggestion({
          suggestion,
          active,
          suggestionProps: {
            key,
            onMouseMove: handleMouseOverSuggestion(index),
            onMouseDown: (event) => event.preventDefault(),
            onClick: handleClickSuggestion(index),
            id: idForSuggestion(key),
            role: 'option',
            tabIndex: -1,
            'aria-selected': active,
          },
        });
      }),
  };
};
