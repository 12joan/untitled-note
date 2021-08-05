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
      <div className="h-100 flex-grow-1 overflow-scroll d-flex flex-column-reverse px-3 py-4">
        <div>
          {
            existingDocuments === undefined
              ? <>Loading&hellip;</>
              : existingDocuments.map(({ id }) => (
                <div key={id} className="py-4">
                  <DocumentEditor id={id} />
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default DocumentIndex
