import React from 'react'
import { useMemo, useState } from 'react'

import keyWithModifiers from '~/lib/keyWithModifiers'

import Tippy from '~/components/Tippy'

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
    } else {
      selectFirstSuggestion()
    }
  }

  return (
    <Tippy
      trigger="manual"
      showOnCreate
      hideOnClick={false}
      placement="bottom-start"
      interactive
      render={attrs => showSuggestions && (
        <div
          {...attrs}
          className="bg-slate-100/75 dark:bg-slate-700/75 backdrop-blur shadow-lg rounded-lg overflow-hidden w-48 max-w-full"
          role="listbox"
          aria-activedescendant={idForSuggestion(activeSuggestionKey)}
        >
          {suggestions.map((suggestion, index) => {
            const key = keyForSuggestion(suggestion)
            const active = key === activeSuggestionKey

            return renderSuggestion({
              suggestion,
              active,
              handleMouseOver: handleMouseOverSuggestion(index),
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
        </div>
      )}
      children={renderInput({
        handleKeyDown,
        handleFocus: () => setInputFocused(true),
        handleBlur: () => setInputFocused(false),
        accessibilityProps: {
          role: 'combobox',
          'aria-expanded': showSuggestions,
        },
      })}
    />
  )
}

export default Combobox
