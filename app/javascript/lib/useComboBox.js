import { useState } from 'react'

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

  const handleKeyDown = event => {
    switch (event.key) {
      case 'ArrowUp':
        handleArrowKey(-1)
        break

      case 'ArrowDown':
        handleArrowKey(1)
        break

      case 'Tab':
        handleTab(event.shiftKey ? -1 : 1, event)
        break
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

  return { selectedIndex, comboBoxProps, suggestionListProps, nthSuggestionProps }
}

export default useComboBox
