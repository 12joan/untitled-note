import React from 'react'
import { useState, useContext, useEffect } from 'react'
import ProjectContext from 'lib/contexts/ProjectContext'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import DocumentEditor from 'components/documents/DocumentEditor'

const DocumentIndex = props => {
  const [existingDocuments, setExistingDocuments] = useState(undefined)

  const projectId = useContext(ProjectContext)

  useEffect(() => DocumentsAPI(projectId).index().then(setExistingDocuments), [projectId])

  return (
    <div className="h-100 d-flex">
      <div className="h-100 flex-grow-1 overflow-scroll d-flex flex-column-reverse px-4 pt-4 mb-n4">
        <div>
          {
            existingDocuments === undefined
              ? <>Loading&hellip;</>
              : existingDocuments.map(({ id }) => (
                <div key={id} className="mb-4">
                  <DocumentEditor id={id} openable />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default DocumentIndex
