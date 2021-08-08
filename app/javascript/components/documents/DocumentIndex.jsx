import React from 'react'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import KeywordDocumentsAPI from 'lib/resources/KeywordDocumentsAPI'

import LoadPromise from 'components/LoadPromise'
import DocumentEditor from 'components/documents/DocumentEditor'

const DocumentIndex = props => {
  const { projectId, keywordId, sortParameter } = useContext()

  const action = keywordId === undefined
    ? (...args) => DocumentsAPI(projectId).index(...args)
    : (...args) => KeywordDocumentsAPI(projectId, keywordId).index(...args)

  return (
    <div className="h-100 d-flex">
      <div className="h-100 flex-grow-1 overflow-scroll d-flex flex-column-reverse px-4 pt-4 mb-n4">
        <div>
          <LoadPromise
            dependencies={[projectId, keywordId, sortParameter]}
            promise={() => action({
              searchParams: { 'sort_by': sortParameter },
            })}

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
      </div>
    </div>
  )
}

export default DocumentIndex
