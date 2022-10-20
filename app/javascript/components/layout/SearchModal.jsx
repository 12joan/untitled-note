import React, { useRef, useEffect, useState, useMemo } from 'react'
import { localeIncludes } from 'locale-includes'
import { useNavigate } from 'react-router-dom'

import { useContext } from '~/lib/context'
import useWaitUntilSettled from '~/lib/useWaitUntilSettled'
import SearchAPI from '~/lib/resources/SearchAPI'
import { FutureServiceResult } from '~/lib/future'
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

const makeDynamicSuggestion = (
  item,
  handleAction,
  {
    getKey,
    getLabel,
    getSnippet = () => undefined,
    action,
    ...rest
  },
) => ({
  key: getKey(item),
  label: getLabel(item),
  snippet: getSnippet(item),
  onCommit: () => handleAction(() => action(item)),
  ...rest,
})

const makeListSource = ({ list, ...rest }) => (searchQuery, handleAction) => list.map(
  item => makeDynamicSuggestion(item, handleAction, rest)
)

const filter = (haystack, needle) => localeIncludes(haystack, needle, { usage: 'search', sensitivity: 'base' })

const makeFilteredListSource = ({
  list,
  include = () => true,
  getFilterable,
  ...rest
}) => (searchQuery, handleAction) => list
  .filter(item => {
    if (!include(item)) {
      return false
    }

    const filterable = getFilterable(item)
    return filterable && filter(filterable, searchQuery)
  })
  .map(item => makeDynamicSuggestion(item, handleAction, rest))

const makeSingletonSource = ({ name, action, ...rest }) => (searchQuery, handleAction) => filter(name, searchQuery)
  ? [{ key: name, label: name, onCommit: () => handleAction(() => action()), ...rest }]
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

  const searchAPI = SearchAPI(currentProject.id)
  const [fsrSearchResults, setFsrSearchResults] = useState(() => FutureServiceResult.success([]))
  const searchResults = useMemo(() => fsrSearchResults.orDefault([]), [fsrSearchResults])
  const searchResultDocumentIds = useMemo(() => searchResults.map(({ document: { id } }) => parseInt(id)), [searchResults])

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

  useEffect(() => setFsrSearchResults(FutureServiceResult.pending()), [trimmedSearchQuery])

  useWaitUntilSettled(trimmedSearchQuery, () => {
    if (!isEmpty) {
      FutureServiceResult.fromPromise(
        searchAPI.search(trimmedSearchQuery),
        setFsrSearchResults
      )
    }
  })

  const suggestions = useMemo(() => 
    [
      makeSingletonSource({ name: 'Overview', action: () => navigate(overviewPath(currentProject.id)) }),
      makeSingletonSource({ name: 'Edit project', action: () => navigate(editProjectPath(currentProject.id)) }),
      makeSingletonSource({ name: 'Recently viewed', action: () => navigate(recentlyViewedPath(currentProject.id)) }),
      makeSingletonSource({ name: 'All tags', action: () => navigate(tagsPath(currentProject.id)) }),
      makeSingletonSource({ name: 'New document', action: performNewDocument }),

      makeFilteredListSource({
        list: projects,
        include: ({ id }) => id !== currentProject.id,
        getFilterable: ({ name }) => name,
        getKey: ({ id }) => `project-${id}`,
        getLabel: ({ name }) => name,
        action: ({ id }) => navigate(projectPath(id)),
      }),

      makeFilteredListSource({
        list: tags,
        getFilterable: ({ text }) => text,
        getKey: ({ id }) => `tag-${id}`,
        getLabel: ({ text }) => text,
        action: ({ id }) => navigate(tagPath(currentProject.id, id)),
      }),

      makeFilteredListSource({
        list: partialDocuments.filter(({ id }) => !searchResultDocumentIds.includes(id)),
        getFilterable: ({ title }) => title,
        getKey: ({ id }) => `document-${id}`,
        getLabel: ({ title }) => title,
        action: ({ id }) => navigate(documentPath(currentProject.id, id)),
      }),

      makeListSource({
        list: searchResults,
        getKey: ({ document: { id } }) => `document-${id}`,
        getLabel: ({ document: { safe_title } }) => safe_title,
        getSnippet: ({ highlights }) => {
          const snippet = highlights
            .filter(({ field }) => field === 'plain_body')
            .map(({ snippet }) => snippet)
            .join(' ')

          return snippet.length > 0 ? snippet : undefined
        },
        action: ({ document: { id } }) => navigate(documentPath(currentProject.id, id)),
      }),
    ].flatMap(source => source(trimmedSearchQuery, handleAction)),
    [trimmedSearchQuery, projects, currentProject, tags, partialDocuments, searchResults]
  )

  const { inputProps, showSuggestions, suggestionContainerProps, mapSuggestions } = useCombobox({
    query: searchQuery,
    suggestions,
    keyForSuggestion: ({ key }) => key,
    onCommit: ({ onCommit }) => onCommit(),
    hideWhenNoSuggestions: false,
  })

  const hint = fsrSearchResults.unwrap({
    pending: () => 'Searching...',
    success: () => suggestions.length === 0 ? 'No results' : undefined,
    failure: () => 'Something went wrong',
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
            <div {...suggestionContainerProps} className="px-3 py-3 border-t border-black/10 select-none">
              {mapSuggestions(({ suggestion: { label, snippet }, active, suggestionProps }) => (
                <div
                  {...suggestionProps}
                  data-active={active}
                  className="p-2 rounded-lg data-active:bg-primary-500 dark:data-active:bg-primary-400 data-active:text-white cursor-pointer"
                >
                  <div>{label}</div>

                  {snippet && (
                    <div className="text-sm" dangerouslySetInnerHTML={{ __html: snippet }} />
                  )}
                </div>
              ))}

              {hint && (
                <div className="p-2 text-slate-500 dark:text-slate-400" aria-live="polite">
                  {hint}
                </div>
              )}
            </div>
          )}
        </ModalPanel>
      </div>
    </ModalRoot>
  )
}

export default SearchModal
