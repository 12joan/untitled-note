import React, { useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  getMentionOnSelectItem,
  findMentionInput,
  removeMentionInput,
  ELEMENT_MENTION,
} from '@udecode/plate-headless'
import { useSelected, useFocused } from 'slate-react'

import { useContext } from '~/lib/context'
import groupedClassNames from '~/lib/groupedClassNames'
import getPlainBody from '~/lib/editor/getPlainBody'
import { useEditorEvent } from '~/lib/editor/imperativeEvents'
import useCombobox from '~/lib/useCombobox'
import useComboboxFloating from '~/lib/useComboboxFloating'
import includes from '~/lib/includes'
import { DocumentLink } from '~/lib/routes'

import { InlinePlaceholder } from '~/components/Placeholder'
import DocumentIcon from '~/components/icons/DocumentIcon'
import DeleteIcon from '~/components/icons/DeleteIcon'

const MentionComponent = ({ attributes, children, element }) => {
  const { futurePartialDocuments } = useContext()
  const linkRef = useRef()

  const futureDocument = futurePartialDocuments.map(
    partialDocuments => partialDocuments.find(doc => doc.id === element.documentId)
  )

  const selected = useSelected()
  const focused = useFocused()
  const selectedAndFocused = selected && focused

  useEditorEvent.onKeyDown(event => {
    if (selectedAndFocused && event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      linkRef.current.click()
    }
  }, [selectedAndFocused])

  const className = groupedClassNames({
    main: 'btn btn-link btn-no-rounded rounded font-medium no-underline',
    selected: selectedAndFocused && 'focus-ring',
  })

  return (
    <>
      <span {...attributes} contentEditable={false}>
        {futureDocument.map(doc => (
          <DocumentLink
            ref={linkRef}
            contentEditable={false}
            className={className}
            documentId={element.documentId}
            children={doc?.safe_title ?? `[Deleted document: ${element.fallbackText}]`}
          />
        )).orDefault(<InlinePlaceholder />)}

        {children}
      </span>
    </>
  )
}

const MentionInputComponent = ({ editor, attributes, children, element }) => {
  const { futurePartialDocuments, mentionSuggestionsContainerRef } = useContext()

  const handleSelectItem = item => getMentionOnSelectItem({ key: ELEMENT_MENTION })(editor, item)

  const query = getPlainBody(element)
  const [, path] = findMentionInput(editor)

  const matchingDocuments = useMemo(() => futurePartialDocuments.orDefault([]).filter(
    doc => doc.title && includes(doc.title, query)
  ), [futurePartialDocuments, query])

  const suggestions = useMemo(() => [
    ...matchingDocuments.map(doc => ({
      key: doc.id,
      icon: <DocumentIcon size="1.25em" noAriaLabel className="text-primary-500 dark:text-primary-400 data-active:text-white" />,
      label: doc.title,
      onCommit: () => handleSelectItem({
        documentId: doc.id,
        fallbackText: doc.safe_title,
      }),
    })),

    {
      key: 'cancel',
      icon: <DeleteIcon size="1.25em" noAriaLabel className="text-red-500 dark:text-red-400 data-active:text-white" />,
      label: 'Cancel mention',
      onCommit: () => removeMentionInput(editor, path),
    },
  ], [matchingDocuments, path])

  const { inputProps, showSuggestions, suggestionContainerProps, mapSuggestions } = useCombobox({
    query,
    suggestions,
    keyForSuggestion: ({ key }) => key,
    onCommit: ({ onCommit }) => onCommit(),
    completeOnTab: true,
    hideWhenEmptyQuery: false,
  })

  // onFocus and onBlur are intentionally not used
  const { onChange, onKeyDown, onFocus, onBlur, ...restInputProps } = inputProps

  useEditorEvent.onChange(onChange, [onChange])
  useEditorEvent.onKeyDown(onKeyDown, [onKeyDown])

  const comboboxFloating = useComboboxFloating()

  const suggestionsContainer = showSuggestions && (
    <div
      {...comboboxFloating.suggestionsProps}
      {...suggestionContainerProps}
      className="z-20 bg-slate-100/75 dark:bg-slate-700/75 backdrop-blur shadow-lg rounded-lg w-48 max-w-full overflow-y-scroll"
    >
      {mapSuggestions(({ suggestion: { icon, label }, active, suggestionProps }) => (
        <div
          {...suggestionProps}
          data-active={active}
          className="px-3 py-2 data-active:bg-primary-500 dark:data-active:bg-primary-400 data-active:text-white cursor-pointer flex gap-2 items-center"
        >
          {icon}
          <span>{label}</span>
        </div>
      ))}
    </div>
  )

  const mentionSuggestionsContainer = mentionSuggestionsContainerRef.current

  return (
    <>
      <span
        {...attributes}
        {...comboboxFloating.inputProps}
        {...restInputProps}
        className="btn btn-link cursor-text font-medium"
      >
        @{children}
      </span>

      {mentionSuggestionsContainer && createPortal(
        suggestionsContainer,
        mentionSuggestionsContainer,
      )}
    </>
  )
}

export {
  MentionComponent,
  MentionInputComponent,
}
