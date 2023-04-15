import React, { forwardRef, useMemo, useImperativeHandle, useRef, useState } from 'react'

import { useContext } from '~/lib/context'
import { TagLink } from '~/lib/routes'
import useCombobox from '~/lib/useCombobox'
import useComboboxFloating from '~/lib/useComboboxFloating'
import includes from '~/lib/includes'

import CloseIcon from '~/components/icons/CloseIcon'
import PlusIcon from '~/components/icons/PlusIcon'

const tagClassName = 'bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center'
const tagButtonClassName = 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400 rounded-full flex items-center justify-center'

const EditorTags = forwardRef(({ workingDocument, updateDocument, visible, setVisible }, ref) => {
  const { tags } = workingDocument
  const tagTexts = useMemo(() => tags.map(tag => tag.text), [tags])
  const hasTagWithText = tagText => tagTexts.includes(tagText)
  const addTag = tag => updateDocument({ tags: [...tags, tag] })
  const makeTagWithText = tagText => ({ localId: Math.random(), text: tagText })

  const removeTag = tag => {
    const remainingTags = tags.filter(t => t.text !== tag.text)
    updateDocument({ tags: remainingTags })
    return remainingTags
  }

  const { futureTags: futureAllTags } = useContext()
  const allTags = futureAllTags.orDefault([])

  const unusedTags = useMemo(() => allTags.filter(
    tag => !hasTagWithText(tag.text)
  ), [futureAllTags, tagTexts])

  const inputRef = useRef()

  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const trimmedInputValue = inputValue.replace(/\s+/g, ' ').trim()

  const filteredUnusedTags = useMemo(() => unusedTags.filter(
    tag => includes(tag.text, trimmedInputValue)
  ), [unusedTags, trimmedInputValue])

  const suggestions = useMemo(() => {
    const suggestions = filteredUnusedTags.map(tag => ({
      key: tag.text,
      text: tag.text,
      tag,
    }))

    if (!allTags.some(tag => tag.text.toLowerCase() === trimmedInputValue.toLowerCase())) {
      suggestions.push({
        key: 'new',
        text: `Create "${trimmedInputValue}"`,
        tag: makeTagWithText(trimmedInputValue),
      })
    }

    return suggestions
  }, [filteredUnusedTags, allTags, trimmedInputValue])

  const focusInput = () => {
    setInputVisible(true)
    setTimeout(() => inputRef.current.focus(), 0)
  }

  useImperativeHandle(ref, () => ({ focus: focusInput }))

  const linkForTag = ({ tag: { id, text }, ...otherProps }) => id
    ? <TagLink tagId={id} children={text} {...otherProps} />
    : <span tabIndex="0" children={text} {...otherProps} />

  const comboboxFloating = useComboboxFloating()

  const { inputProps, showSuggestions, suggestionContainerProps, mapSuggestions } = useCombobox({
    query: trimmedInputValue,
    suggestions,
    keyForSuggestion: ({ key }) => key,
    onCommit: ({ tag }) => {
      addTag(tag)
      setInputValue('')
    },
    completeOnTab: true,
    hideOnBlur: true,
  })

  return (
    <div className="lg:narrow mt-3 flex flex-wrap gap-2" style={{ display: visible ? undefined : 'none' }}>
      {tags.map(tag => (
        <div
          key={tag.id ?? tag.localId}
          className={`${tagClassName} stretch-focus-visible:focus-ring stretch-hover:bg-slate-200 dark:stretch-hover:bg-slate-700`}
        >
          {linkForTag({ tag, className: 'px-3 py-1 stretch-target no-focus-ring' })}

          <button
            type="button"
            className={`${tagButtonClassName} w-6 h-6 -ml-2 mr-1`}
            onClick={() => {
              const remainingTags = removeTag(tag)
              setVisible(remainingTags.length > 0)
            }}
          >
            <CloseIcon size="1.5em" ariaLabel="Remove tag" />
          </button>
        </div>
      ))}

      <button
        type="button"
        className={`${tagClassName} ${tagButtonClassName} w-8 h-8`}
        style={{
          display: inputVisible ? 'none' : undefined,
        }}
        onClick={focusInput}
      >
        <PlusIcon size="1.5em" ariaLabel="Add tag" />
      </button>

      <div className="h-8 flex items-center" style={{ display: inputVisible ? undefined : 'none' }}>
        <div {...comboboxFloating.inputProps}>
          <input
            {...inputProps}
            ref={inputRef}
            type="text"
            className="no-focus-ring bg-transparent"
            value={inputValue}
            onChange={event => {
              inputProps.onChange(event)
              setInputValue(event.target.value)
            }}
            onKeyDown={event => {
              inputProps.onKeyDown(event)

              if (event.key === 'Backspace' && inputValue.length === 0 && tags.length > 0) {
                removeTag(tags[tags.length - 1])
              }

              if (event.key === 'Escape') {
                setInputValue('')
              }
            }}
            onBlur={event => {
              inputProps.onBlur(event)

              if (trimmedInputValue.length === 0) {
                setInputValue('')
                setInputVisible(false)
                setVisible(tags.length > 0)
              }
            }}
            placeholder="Type to add tag"
          />
        </div>

        {showSuggestions && (
          <div
            {...comboboxFloating.suggestionsProps}
            className="z-20 bg-slate-100/75 dark:bg-slate-700/75 backdrop-blur shadow-lg rounded-lg w-48 max-w-full overflow-y-scroll"
          >
            {mapSuggestions(({ suggestion, active, suggestionProps }) => (
              <div
                {...suggestionProps}
                data-active={active}
                className="px-3 py-2 data-active:bg-primary-500 dark:data-active:bg-primary-400 data-active:text-white cursor-pointer"
                children={suggestion.text}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default EditorTags
