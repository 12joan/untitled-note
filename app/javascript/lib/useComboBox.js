import React from 'react'
import { useState } from 'react'

import modifierKey from 'lib/modifierKey'
import classList from 'lib/classList'

const mod = (n, d) => ((n % d) + d) % d

const useComboBox = ({ suggestionCount, suggestionListId, nthSuggestionId }) => {
  let [selectedIndex, setSelectedIndex] = useState(null)

  if (suggestionCount === 0) {
    selectedIndex = null
  }

  const lastSuggestionIndex = suggestionCount - 1

  const handleArrowKey = direction => {
    const currentSelectedIndex = selectedIndex ?? (
      direction === 1 ? -1 : lastSuggestionIndex + 1
    )

    setSelectedIndex(mod(currentSelectedIndex + direction, suggestionCount))
  }

  const handleTab = (direction, event) => {
    const newSelectedIndex = (selectedIndex ?? -1) + direction

    if (newSelectedIndex >= 0 && newSelectedIndex <= lastSuggestionIndex) {
      setSelectedIndex(newSelectedIndex)
      event.preventDefault()
    } else {
      setSelectedIndex(null)
    }
  }

  const clickNthSuggestion = index => {
    document.getElementById(nthSuggestionId(index))
      .querySelector('.stretched-link')
      .click()
  }

  const handleKeyDown = event => {
    switch (event.key) {
      case 'ArrowUp':
        handleArrowKey(-1)
        event.preventDefault()
        break

      case 'ArrowDown':
        handleArrowKey(1)
        event.preventDefault()
        break

      case 'Tab':
        handleTab(event.shiftKey ? -1 : 1, event)
        break

      case 'Enter':
        if (selectedIndex !== null) {
          clickNthSuggestion(selectedIndex)
          event.preventDefault()
        }
        break
    }

    if (/[1-9]/.test(event.key) && (event.metaKey || event.ctrlKey)) {
      const index = Number(event.key) - 1

      if (index <= lastSuggestionIndex) {
        clickNthSuggestion(index)
        event.preventDefault()
      }
    }
  }

  const comboBoxProps = {
    'role': 'combobox',
    'aria-autocomplete': 'list',
    'aria-owns': suggestionListId,
    'aria-activedescendant': selectedIndex === null ? undefined : nthSuggestionId(selectedIndex),
    'onKeyDown': handleKeyDown,
    'onChange': event => setSelectedIndex(event.target.value === '' ? null : 0),
  }

  const suggestionListProps = {
    'id': suggestionListId,
    'role': 'listbox',
  }

  const nthSuggestionProps = index => ({
    'id': nthSuggestionId(index),
    'role': 'option',
    'aria-selected': index === selectedIndex,
    'onMouseMove': () => setSelectedIndex(index),
    'onMouseOut': () => setSelectedIndex(null),
  })

  const isPhone = /phone/i.test(navigator.userAgent)

  const nthKeyboardShortcutBadge = index => {
    if (isPhone)
      return null

    const greaterThan9 = (index + 1) > 9
    const selected = index === selectedIndex
    const showBadge = !greaterThan9 || selected

    return (
      <span
        className={classList(['bg-light text-dark text-center small rounded border px-2 py-1', { 'invisible': !showBadge }])}
        aria-hidden={!showBadge}
        style={{ minWidth: '3em' }}>
        {
          selected ? '↵' : `${modifierKey.symbol}${index + 1}`
        }
      </span>
    )
  }

  return { selectedIndex, comboBoxProps, suggestionListProps, nthSuggestionProps, nthKeyboardShortcutBadge }
}

export default useComboBox
