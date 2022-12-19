import React, { useRef, useEffect, useState, useMemo } from 'react'
import { localeIncludes } from 'locale-includes'
import { useNavigate } from 'react-router-dom'

import useModal from '~/lib/useModal'
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

import SearchIcon from '~/components/icons/SearchIcon'
import OverviewIcon from '~/components/icons/OverviewIcon'
import SettingsIcon from '~/components/icons/SettingsIcon'
import RecentIcon from '~/components/icons/RecentIcon'
import TagsIcon from '~/components/icons/TagsIcon'
import NewDocumentIcon from '~/components/icons/NewDocumentIcon'
import ProjectIcon from '~/components/ProjectIcon'
import TagIcon from '~/components/icons/TagIcon'
import DocumentIcon from '~/components/icons/DocumentIcon'

const useSearchModal = () => useModal(SearchModal, {
  customBackdropClassNames: {
    overflow: null,
    bg: null,
  },
  customPanelClassNames: {
    margin: 'mt-[20vh] mb-auto',
    width: 'narrow',
    shadow: 'before:shadow-dialog-heavy',
    rounded: 'before:rounded-xl',
    padding: null,
    bg: 'before:bg-slate-50/75 before:dark:bg-slate-700/75',
  },
})

const makeDynamicSuggestion = (
  item,
  handleAction,
  {
    getKey,
    getLabel,
    getIcon = () => undefined,
    getDescription = () => undefined,
    action,
    ...rest
  },
) => ({
  key: getKey(item),
  label: getLabel(item),
  icon: getIcon(item),
  description: getDescription(item),
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

const SearchModal = ({ onClose }) => {
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
    const input = inputRef.current
    input.focus()
    input.setSelectionRange(0, input.value.length)
  }, [])

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
      makeSingletonSource({
        name: 'Overview',
        icon: <OverviewIcon size="1.25em" noAriaLabel />,
        description: 'Jump to overview',
        action: () => navigate(overviewPath(currentProject.id)),
      }),

      makeSingletonSource({
        name: 'Edit project',
        icon: <SettingsIcon size="1.25em" noAriaLabel />,
        description: 'Jump to edit project',
        action: () => navigate(editProjectPath(currentProject.id)),
      }),

      makeSingletonSource({
        name: 'Recently viewed',
        icon: <RecentIcon size="1.25em" noAriaLabel />,
        description: 'Jump to recently viewed',
        action: () => navigate(recentlyViewedPath(currentProject.id)),
      }),

      makeSingletonSource({
        name: 'All tags',
        icon: <TagsIcon size="1.25em" noAriaLabel />,
        description: 'Jump to all tags',
        action: () => navigate(tagsPath(currentProject.id)),
      }),

      makeSingletonSource({
        name: 'New document',
        icon: <NewDocumentIcon size="1.25em" noAriaLabel />,
        description: 'Create new document',
        action: performNewDocument,
      }),

      makeFilteredListSource({
        list: projects,
        include: ({ id }) => id !== currentProject.id,
        getFilterable: ({ name }) => name,
        getKey: ({ id }) => `project-${id}`,
        getLabel: ({ name }) => name,
        getIcon: project => <ProjectIcon project={project} className="w-5 h-5 rounded text-xs shadow-sm" />,
        action: ({ id }) => navigate(projectPath(id)),
        description: 'Switch to project',
      }),

      makeFilteredListSource({
        list: tags,
        getFilterable: ({ text }) => text,
        getKey: ({ id }) => `tag-${id}`,
        getLabel: ({ text }) => text,
        icon: <TagIcon size="1.25em" noAriaLabel />,
        action: ({ id }) => navigate(tagPath(currentProject.id, id)),
        description: 'Jump to tag',
      }),

      makeFilteredListSource({
        list: partialDocuments.filter(({ id }) => !searchResultDocumentIds.includes(id)),
        getFilterable: ({ title }) => title,
        getKey: ({ id }) => `document-${id}`,
        getLabel: ({ title }) => title,
        icon: <DocumentIcon size="1.25em" noAriaLabel />,
        description: 'Open document',
        action: ({ id }) => navigate(documentPath(currentProject.id, id)),
      }),

      makeListSource({
        list: searchResults,
        getKey: ({ document: { id } }) => `document-${id}`,
        getLabel: ({ document: { safe_title } }) => safe_title,
        icon: <DocumentIcon size="1.25em" noAriaLabel />,
        getDescription: ({ highlights }) => {
          const snippet = highlights
            .filter(({ field }) => field === 'plain_body')
            .map(({ snippet }) => snippet)
            .join(' ')

          return snippet.length > 0 ? { __html: snippet } : 'Open document'
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

  return (
    <>
      <div className="flex px-5 py-3 gap-2 items-center">
        <SearchIcon size="1.25em" className="text-slate-500 dark:text-slate-400" noAriaLabel />

        <input
          {...inputProps}
          ref={inputRef}
          type="text"
          className="grow text-xl bg-transparent no-focus-ring"
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
      </div>

      {showSuggestions && (
        <div {...suggestionContainerProps} className="px-3 py-3 border-t border-black/10 select-none max-h-[50vh] overflow-y-auto">
          {mapSuggestions(({ suggestion: { label, icon, description }, active, suggestionProps }) => (
            <div
              {...suggestionProps}
              data-active={active}
              className="p-2 rounded-lg data-active:bg-primary-500 dark:data-active:bg-primary-400 data-active:text-white cursor-pointer scroll-my-3 flex gap-2"
            >
              <div className="translate-y-0.5 w-5 h-5 text-primary-500 dark:text-primary-400 data-active:text-white dark:data-active:text-white">
                {icon}
              </div>

              <div className="grow">
                <div>{label}</div>

                {typeof description === 'string' && (
                  <div
                    className="text-sm text-slate-500 dark:text-slate-400 data-active:text-white dark:data-active:text-white"
                    children={description}
                  />
                )}

                {typeof description === 'object' && (
                  <div className="text-sm" dangerouslySetInnerHTML={description} />
                )}
              </div>
            </div>
          ))}

          {hint && (
            <div className="p-2 text-slate-500 dark:text-slate-400" aria-live="polite">
              {hint}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default useSearchModal
