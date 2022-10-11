import React from 'react'
import { useMemo, useState, useLayoutEffect } from 'react'
import { useFloating, offset, shift, size } from '@floating-ui/react-dom'

import keyWithModifiers from '~/lib/keyWithModifiers'

const positiveMod = (a, b) => ((a % b) + b) % b

const Combobox = ({ query, suggestions, keyForSuggestion, onCommit, renderInput, renderSuggestion }) => {
  const idPrefix = useMemo(() => `combobox-${Math.random().toString(36).slice(2)}-`, [])
  const idForSuggestion = key => `${idPrefix}${key}`

  const [inputFocused, setInputFocused] = useState(false)
  const showSuggestions = inputFocused && query.length > 0 && suggestions.length > 0

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0)
  const activeSuggestion = suggestions[activeSuggestionIndex]
  const activeSuggestionKey = activeSuggestion && keyForSuggestion(activeSuggestion)

  const selectFirstSuggestion = () => setActiveSuggestionIndex(0)

  const handleMouseOverSuggestion = index => () => setActiveSuggestionIndex(index)
  const handleClickSuggestion = index => () => onCommit(suggestions[index])

  const handleKeyDown = event => {
    const handler = {
      ArrowDown: () => setActiveSuggestionIndex(positiveMod(activeSuggestionIndex + 1, suggestions.length)),
      ArrowUp: () => setActiveSuggestionIndex(positiveMod(activeSuggestionIndex - 1, suggestions.length)),
      Enter: () => onCommit(activeSuggestion),
      Tab: () => onCommit(activeSuggestion),
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
          elements.floating.style.maxHeight = `${availableHeight}px`
        },
        padding: 10,
      }),
    ],
  })

  return (
    <>
      <div
        ref={inputRef}
        children={renderInput({
          handleChange: () => selectFirstSuggestion(),
          handleKeyDown,
          handleFocus: () => setInputFocused(true),
          handleBlur: () => setInputFocused(false),
          accessibilityProps: {
            role: 'combobox',
            'aria-expanded': showSuggestions,
          },
        })}
      />

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="z-20 bg-slate-100/75 dark:bg-slate-700/75 backdrop-blur shadow-lg rounded-lg w-48 max-w-full overflow-y-scroll"
          style={{
            position: suggestionsPosition,
            top: suggestionsY ?? 0,
            left: suggestionsX ?? 0,
          }}
          role="listbox"
          aria-activedescendant={idForSuggestion(activeSuggestionKey)}
          children={suggestions.map((suggestion, index) => {
            const key = keyForSuggestion(suggestion)
            const active = key === activeSuggestionKey

            return renderSuggestion({
              suggestion,
              active,
              handleMouseMove: handleMouseOverSuggestion(index),
              handleMouseDown: event => event.preventDefault(),
              handleClick: handleClickSuggestion(index),
              accessibilityProps: {
                id: idForSuggestion(key),
                key,
                role: 'option',
                tabIndex: -1,
                'aria-selected': active,
              },
            })
          })}
        />
      )}
    </>
  )
}

export default Combobox
