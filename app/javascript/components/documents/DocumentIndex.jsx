import React from 'react'
import { useEffect } from 'react'
import useLocalStorage from 'react-use-localstorage'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import KeywordDocumentsAPI from 'lib/resources/KeywordDocumentsAPI'

import ContentHeader from 'components/layout/ContentHeader'
import DocumentIndexMenu from 'components/documents/DocumentIndexMenu'
import LoadPromise from 'components/LoadPromise'
import LoadDocument from 'components/documents/LoadDocument'

const DocumentIndex = props => {
  const { projectId, keywordId, keyword, documentIndexKey } = useContext()

  const [sortParameter, setSortParameter] = useLocalStorage('document-index-sort-parameter', 'created_at')

  const action = keywordId === undefined
    ? (...args) => DocumentsAPI(projectId).index(...args)
    : (...args) => KeywordDocumentsAPI(projectId, keywordId).index(...args)

  const searchParams = {
    'sort_by': sortParameter,
    'select': 'id',
  }

  const viewDropdownLabel = (keywordId === undefined)
    ? 'All Documents'
    : keyword.text

  return (
    <div className="p-3 pb-0">
      <div className="mb-3">
        <ContentHeader>
          <div className="dropdown">
            <button
              type="button"
              id="view-dropdown"
              className="btn btn-link text-decoration-none dropdown-toggle"
              style={{ fontWeight: 500, whiteSpace: 'inherit' }}
              data-bs-toggle="dropdown"
              data-bs-auto-close="outside"
              aria-expanded="false">
              {viewDropdownLabel}
            </button>

            <ul className="dropdown-menu" aria-labelledby="view-dropdown">
              <DocumentIndexMenu
                sortParameter={sortParameter}
                setSortParameter={setSortParameter} />
            </ul>
          </div>
        </ContentHeader>
      </div>

      <LoadPromise
        dependencies={[sortParameter, documentIndexKey]}
        dependenciesRequiringClear={[projectId, keywordId]}
        promise={() => action({ searchParams })}

        success={documents => documents.map(doc => (
          <div key={doc.id} className="mb-3">
            <LoadDocument
              id={doc.id}
              editorProps={doc => ({
                document: doc,
                openable: true,
                startCollapsedIfLong: true,
              })} />
          </div>
        ))}

        loading={() => <></>}

        error={error => {
          console.error(error)

          return (
            <div className="alert alert-danger">
              <strong>Failed to load documents:</strong> An unexpected error occurred
            </div>
          )
        }} />
    </div>
  )
}

export default DocumentIndex
