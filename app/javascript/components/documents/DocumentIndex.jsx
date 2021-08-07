import React from 'react'
import { useState, useContext, useEffect } from 'react'
import ProjectContext from 'lib/contexts/ProjectContext'
import LoadPromise from 'components/LoadPromise'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import DocumentEditor from 'components/documents/DocumentEditor'

const DocumentIndex = props => {
  const { id: projectId } = useContext(ProjectContext)

  return (
    <div className="h-100 d-flex">
      <div className="h-100 flex-grow-1 overflow-scroll d-flex flex-column-reverse px-4 pt-4 mb-n4">
        <div>
          <LoadPromise
            dependencies={[projectId]}
            promise={() => DocumentsAPI(projectId).index()}

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
