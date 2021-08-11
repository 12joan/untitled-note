import React from 'react'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import LoadPromise from 'components/LoadPromise'
import DocumentEditor from 'components/documents/DocumentEditor'

const ShowDocument = props => {
  const { projectId, keyword } = useContext()

  return (
    <div className="p-4">
      <LoadPromise
        dependencies={[props.id]}
        promise={() => DocumentsAPI(projectId).show(props.id)}

        success={doc => (
          <DocumentEditor
            key={doc.id}
            document={{
              ...doc,
              keywords: (doc.blank && keyword !== undefined)
                ? [...doc.keywords, keyword]
                : doc.keywords,
            }} />
        )}

        loading={() => <></>}

        error={error => {
          console.error(error)

          return (
            <div className="alert alert-danger">
              <strong>Failed to load document:</strong> An unexpected error occurred
            </div>
          )
        }} />
    </div>
  )
}

export default ShowDocument
