import React from 'react'
import { useEffect } from 'react'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import KeywordDocumentsAPI from 'lib/resources/KeywordDocumentsAPI'

import LoadPromise from 'components/LoadPromise'
import DocumentEditor from 'components/documents/DocumentEditor'

const DocumentIndex = props => {
  const { projectId, keywordId, sortParameter, documentIndexKey } = useContext()

  const action = keywordId === undefined
    ? (...args) => DocumentsAPI(projectId).index(...args)
    : (...args) => KeywordDocumentsAPI(projectId, keywordId).index(...args)

  const searchParams = {
    'sort_by': sortParameter,
  }

  if (props.deletedOnly) {
    searchParams.deleted = true
  }

  return (
    <div className="p-4 pb-0">
      <LoadPromise
        dependencies={[sortParameter, documentIndexKey]}
        dependenciesRequiringClear={[projectId, keywordId, props.deletedOnly]}
        promise={() => action({ searchParams })}

        success={documents => documents.map(doc => (
          <div key={doc.id} className="mb-4">
            <DocumentEditor document={doc} openable />
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
