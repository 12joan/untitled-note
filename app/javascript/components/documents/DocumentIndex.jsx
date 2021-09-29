import React from 'react'
import useLocalStorage from 'react-use-localstorage'

import { useContext } from 'lib/context'
import DocumentsStream from 'lib/streams/DocumentsStream'

import ContentHeader from 'components/layout/ContentHeader'
import DocumentIndexMenu from 'components/documents/DocumentIndexMenu'
import LoadAsync from 'components/LoadAsync'
import LoadDocument from 'components/documents/LoadDocument'
import { DocumentGridTile, DocumentGridTilePlaceholder } from 'components/documents/DocumentGridTile'

const DocumentIndex = props => {
  const { projectId, keywordId, keyword } = useContext()

  const [sortParameter, setSortParameter] = useLocalStorage('document-index-sort-parameter', 'created_at')

  const indexParams = {
    query: { id: true },
    keyword_id: keywordId,
    sort_by: sortParameter,
  }

  const viewDropdownLabel = (keywordId === undefined)
    ? 'All Documents'
    : keyword.text

  return (
    <div className="p-3">
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

      <div className="grid">
        <LoadAsync
          dependencies={[sortParameter]}
          dependenciesRequiringClear={[projectId, keywordId]}
          provider={(resolve, reject) => {
            const subscription = DocumentsStream(projectId).index(indexParams, resolve)
            return () => subscription.unsubscribe()
          }}

          success={documents => documents.map(doc => (
            <LoadDocument
              key={doc.id}
              id={doc.id}

              loading={() => <DocumentGridTilePlaceholder />}

              success={doc => (
                <DocumentGridTile doc={doc} />
              )} />
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
    </div>
  )
}

export default DocumentIndex
