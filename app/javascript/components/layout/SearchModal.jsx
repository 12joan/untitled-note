import React, { useRef, useEffect, useState, useMemo } from 'react'
import { localeIncludes } from 'locale-includes'
import { useNavigate } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useCombobox from '~/lib/useCombobox'
import {
  overviewPath,
  editProjectPath,
  recentlyViewedPath,
  tagsPath,
  projectPath,
  tagPath,
  documentPath,
} from '~/lib/routes'
import useNewDocument from '~/lib/useNewDocument'

import { ModalRoot, ModalPanel } from '~/components/Modal'

const filter = (haystack, needle) => localeIncludes(haystack, needle, { usage: 'search', sensitivity: 'base' })

const makeListSource = ({
  list,
  include = () => true,
  getFilterable,
  getKey,
  getLabel,
  action,
}) => (searchQuery, handleAction) => list
  .filter(item => {
    if (!include(item)) {
      return false
    }

    const filterable = getFilterable(item)
    return filterable && filter(filterable, searchQuery)
  })
  .map(item => ({
    key: getKey(item),
    label: getLabel(item),
    onCommit: () => handleAction(() => action(item)),
  }))

const makeSingletonSource = ({ name, action }) => (searchQuery, handleAction) => filter(name, searchQuery)
  ? [{ key: name, label: name, onCommit: () => handleAction(() => action()) }]
  : []

const SearchModal = ({ visible, onClose }) => {
  const navigate = useNavigate()
  const performNewDocument = useNewDocument()

  const { projects, project: currentProject, futureTags, futurePartialDocuments } = useContext()
  const tags = futureTags.orDefault([])
  const partialDocuments = futurePartialDocuments.orDefault([])

  const [searchQuery, setSearchQuery] = useState('')
  const trimmedSearchQuery = searchQuery.trim()
  const isEmpty = trimmedSearchQuery === ''

  const inputRef = useRef()

  useEffect(() => {
    if (visible) {
      const input = inputRef.current
      input.focus()
      input.setSelectionRange(0, input.value.length)
    }
  }, [visible])

  const handleAction = action => {
    onClose()
    action()
  }

  const searchResults = useMemo(() => 
    [
      makeSingletonSource({ name: 'Overview', action: () => navigate(overviewPath(currentProject.id)) }),
      makeSingletonSource({ name: 'Edit project', action: () => navigate(editProjectPath(currentProject.id)) }),
      makeSingletonSource({ name: 'Recently viewed', action: () => navigate(recentlyViewedPath(currentProject.id)) }),
      makeSingletonSource({ name: 'All tags', action: () => navigate(tagsPath(currentProject.id)) }),
      makeSingletonSource({ name: 'New document', action: performNewDocument }),

      makeListSource({
        list: projects,
        include: ({ id }) => id !== currentProject.id,
        getFilterable: ({ name }) => name,
        getKey: ({ id }) => `project-${id}`,
        getLabel: ({ name }) => name,
        action: ({ id }) => navigate(projectPath(id)),
      }),

      makeListSource({
        list: tags,
        getFilterable: ({ text }) => text,
        getKey: ({ id }) => `tag-${id}`,
        getLabel: ({ text }) => text,
        action: ({ id }) => navigate(tagPath(currentProject.id, id)),
      }),

      makeListSource({
        list: partialDocuments,
        getFilterable: ({ title }) => title,
        getKey: ({ id }) => `document-${id}`,
        getLabel: ({ title }) => title,
        action: ({ id }) => navigate(documentPath(currentProject.id, id)),
      }),
    ].flatMap(source => source(trimmedSearchQuery, handleAction)),
    [projects, currentProject, partialDocuments, trimmedSearchQuery]
  )

  const { inputProps, showSuggestions, suggestionContainerProps, mapSuggestions } = useCombobox({
    query: searchQuery,
    suggestions: searchResults,
    keyForSuggestion: ({ key }) => key,
    onCommit: ({ onCommit }) => onCommit(),
  })

  return visible && (
    <ModalRoot open={visible} onClose={onClose}>
      <div className="fixed inset-0 flex p-5 overflow-y-auto">
        <ModalPanel className="mt-[20vh] mb-auto narrow bg-slate-50/75 dark:bg-slate-700/75 backdrop-blur-lg shadow-dialog rounded-xl">
          <input
            {...inputProps}
            ref={inputRef}
            type="text"
            className="block w-full text-xl px-5 py-3 bg-transparent no-focus-ring"
            placeholder={`Search ${currentProject.name}`}
            value={searchQuery}
            onChange={event => {
              setSearchQuery(event.target.value)
              inputProps.onChange(event)
            }}
            onKeyDown={event => {
              inputProps.onKeyDown(event)

              if (event.key === 'Escape' && !isEmpty) {
                event.preventDefault()
                event.stopPropagation()
                setSearchQuery('')
              }
            }}
          />

          {showSuggestions && (
            <div {...suggestionContainerProps} className="px-3 py-3 border-t border-black/10">
              {mapSuggestions(({ suggestion: { label }, active, suggestionProps }) => (
                <div
                  {...suggestionProps}
                  data-active={active}
                  className="p-2 rounded-lg data-active:bg-primary-500 dark:data-active:bg-primary-400 data-active:text-white cursor-pointer"
                  children={label}
                />
              ))}
            </div>
          )}
        </ModalPanel>
      </div>
    </ModalRoot>
  )
}

export default SearchModal
