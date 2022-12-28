import React from 'react'
import { useMemo, useState, useLayoutEffect } from 'react'

import keyWithModifiers from '~/lib/keyWithModifiers'

const positiveMod = (a, b) => ((a % b) + b) % b

const useCombobox = ({
  query,
  suggestions,
  keyForSuggestion,
  onCommit,
  completeOnTab = false,
  hideOnBlur = false,
  hideWhenNoSuggestions = true,
  hideWhenEmptyQuery = true,
}) => {
  const idPrefix = useMemo(() => `combobox-${Math.random().toString(36).slice(2)}-`, [])
  const idForSuggestion = key => `${idPrefix}${key}`

  const [inputFocused, setInputFocused] = useState(false)

  const showSuggestions = (!hideOnBlur || inputFocused)
    && (!hideWhenEmptyQuery || query.length > 0)
    && (!hideWhenNoSuggestions || suggestions.length > 0)

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const activeSuggestion = suggestions[activeSuggestionIndex]
  const activeSuggestionKey = activeSuggestion && keyForSuggestion(activeSuggestion)

  const selectFirstSuggestion = () => setActiveSuggestionIndex(0)

  const handleMouseOverSuggestion = index => () => setActiveSuggestionIndex(index)
  const handleClickSuggestion = index => () => onCommit(suggestions[index])

  const handleKeyDown = event => {
    const step = delta => setActiveSuggestionIndex(positiveMod(activeSuggestionIndex + delta, suggestions.length))

    const handler = {
      ArrowDown: () => step(1),
      ArrowUp: () => step(-1),
      Enter: () => onCommit(activeSuggestion),
      ...(completeOnTab
        ? { Tab: () => onCommit(activeSuggestion) }
        : { Tab: () => step(1), ShiftTab: () => step(-1) }
      ),
    }[keyWithModifiers(event)]

    if (showSuggestions && handler) {
      event.preventDefault()
      handler()
    }
  }

  // Scroll active suggestion into view
  useLayoutEffect(() => {
    if (activeSuggestionKey) {
      const activeSuggestionElement = document.getElementById(idForSuggestion(activeSuggestionKey))
      activeSuggestionElement?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeSuggestionKey])

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
    },

    mapSuggestions: renderSuggestion => suggestions.map((suggestion, index) => {
      const key = keyForSuggestion(suggestion)
      const active = key === activeSuggestionKey

      return renderSuggestion({
        suggestion,
        active,
        suggestionProps: {
          key,
          onMouseMove: handleMouseOverSuggestion(index),
          onMouseDown: event => event.preventDefault(),
          onClick: handleClickSuggestion(index),
          id: idForSuggestion(key),
          role: 'option',
          tabIndex: -1,
          'aria-selected': active,
        },
      })
    }),
  }
}

export default useCombobox
