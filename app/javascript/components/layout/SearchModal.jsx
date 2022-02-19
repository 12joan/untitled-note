import React from 'react'
import { useState } from 'react'
import { Search } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'
import useDirty from 'lib/useDirty'
import useRemountKey from 'lib/useRemountKey'
import useComboBox from 'lib/useComboBox'
import classList from 'lib/classList'
import DocumentSearchAPI from 'lib/DocumentSearchAPI'

import Modal from 'components/Modal'
import NavLink from 'components/NavLink'
import LoadingPlaceholder from 'components/LoadingPlaceholder'

const SearchForm = props => {
  const { project } = useContext()

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const fetchSearchResults = () => {
    const promise = /[^\s]/.test(query)
      ? DocumentSearchAPI(project.id).search(query)
      : Promise.resolve([])

    return promise.then(setSearchResults)
  }

  const { isDirty, makeDirty, enqueueFetch } = useDirty(fetchSearchResults, 100)

  const handleChange = event => {
    const query = event.target.value
    setQuery(query)
    makeDirty()

    if (!/[^\s]/.test(query)) {
      enqueueFetch()
    }
  }

  const { selectedIndex, comboBoxProps, suggestionListProps, nthSuggestionProps, nthKeyboardShortcutBadge } = useComboBox({
    suggestionCount: searchResults.length,
    suggestionListId: 'search-results',
    nthSuggestionId: index => `search-result-${index}`,
  })

  return (
    <>
      <div className="layout-row align-items-center px-4">
        <button
          type="button"
          className="btn-close order-last"
          data-bs-dismiss="modal"
          aria-label="Close" />

        <Search className="bi text-muted fs-5" />

        <input
          className="flex-grow-1 form-control form-control-lg border-0 rounded-0 p-3 no-focus-outline"
          placeholder={`Search ${project.name}`}
          value={query}
          data-auto-focus
          {...comboBoxProps}
          onChange={event => {
            handleChange(event)
            comboBoxProps.onChange(event)
          }} />
      </div>

      {
        query.length > 0 && (
          <div className="list-group list-group-flush border-top" {...suggestionListProps}>
            {
              searchResults.length === 0
                ? (
                  <div className="list-group-item layout-row justify-content-center align-items-center bg-light text-muted" style={{ minHeight: '10rem' }}>
                    {
                      isDirty
                        ? <LoadingPlaceholder />
                        : 'No matching documents'
                    }
                  </div>
                )
                : searchResults.map(({ document: doc, highlight }, index) => {
                  const active = index === selectedIndex

                  return (
                    <div
                      key={doc.id}
                      className={classList(["list-group-item layout-row align-items-center gap-3 p-3", { active }])}
                      {...nthSuggestionProps(index)}>
                      {nthKeyboardShortcutBadge(index)}

                      <div>
                        <div className="fs-5">{doc.safe_title}</div>

                        {
                          highlight !== null && (
                            <div className="opacity-75" dangerouslySetInnerHTML={{ __html: highlight }} />
                          )
                        }
                      </div>

                      <NavLink
                        className="stretched-link"
                        tabIndex="-1"
                        params={{ keywordId: undefined, documentId: doc.id }}
                        data-bs-dismiss="modal" />
                    </div>
                  )
                })
            }
          </div>
        )
      }
    </>
  )
}

const SearchModal = props => {
  const [formKey, remountForm] = useRemountKey()

  return (
    <Modal
      id="search-modal"
      modalDialogProps={{ className: 'modal-dialog modal-lg' }}
      modalBodyProps={{ className: 'modal-body p-0' }}
      onShow={remountForm}>
      <SearchForm key={formKey} />
    </Modal>
  )
}

export default SearchModal
