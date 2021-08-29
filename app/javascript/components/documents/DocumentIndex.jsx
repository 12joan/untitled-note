import React from 'react'
import { useEffect } from 'react'
import useLocalStorage from 'react-use-localstorage'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import KeywordDocumentsAPI from 'lib/resources/KeywordDocumentsAPI'

import ContentHeader from 'components/layout/ContentHeader'
import LoadPromise from 'components/LoadPromise'
import DocumentIndexMenu from 'components/documents/DocumentIndexMenu'
import DocumentEditor from 'components/documents/DocumentEditor'

const DocumentIndex = props => {
  const { projectId, keywordId, keyword, documentIndexKey, reloadDocumentIndex } = useContext()

  const [sortParameter, setSortParameter] = useLocalStorage('document-index-sort-parameter', 'created_at')

  const action = keywordId === undefined
    ? (...args) => DocumentsAPI(projectId).index(...args)
    : (...args) => KeywordDocumentsAPI(projectId, keywordId).index(...args)

  const searchParams = {
    'sort_by': sortParameter,
  }

  if (props.deletedOnly) {
    searchParams.deleted = true
  }

  const viewDropdownLabel = props.deletedOnly
    ? 'Recently Deleted'
    : (keywordId === undefined ? 'All Documents' : keyword.text)

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
              <DocumentIndexMenu sortParameter={sortParameter} setSortParameter={setSortParameter} />
            </ul>
          </div>
        </ContentHeader>
      </div>

      <LoadPromise
        dependencies={[sortParameter, documentIndexKey]}
        dependenciesRequiringClear={[projectId, keywordId, props.deletedOnly]}
        promise={() => action({ searchParams })}

        success={documents => documents.map(doc => (
          <div key={doc.id} className="mb-3">
            <DocumentEditor document={doc} openable startCollapsedIfLong />
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
