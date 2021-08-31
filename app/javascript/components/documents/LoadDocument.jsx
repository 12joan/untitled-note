import React from 'react'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import LoadPromise from 'components/LoadPromise'
import DocumentPlaceholder from 'components/documents/DocumentPlaceholder'
import DocumentEditor from 'components/documents/DocumentEditor'

const LoadDocument = props => {
  const { projectId, loadDocumentCache, keyword } = useContext()

  return (
    <LoadPromise
      dependenciesRequiringClear={[props.id]}
      promise={loadDocumentCache.cachePromise(props.id, () => DocumentsAPI(projectId).show(props.id))}

      success={doc => (
        <DocumentEditor
          key={doc.id}
          {...props.editorProps(doc)} />
      )}

      loading={() => <DocumentPlaceholder />}

      error={error => {
        console.error(error)

        return (
          <div className="alert alert-danger">
            <strong>Failed to load document:</strong> An unexpected error occurred
          </div>
        )
      }} />
  )
}

export default LoadDocument
