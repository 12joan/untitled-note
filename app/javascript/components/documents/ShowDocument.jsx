import React from 'react'
import { useContext } from 'react'
import ProjectContext from 'lib/contexts/ProjectContext'
import LoadPromise from 'components/LoadPromise'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import DocumentEditor from 'components/documents/DocumentEditor'

const ShowDocument = props => {
  const projectId = useContext(ProjectContext)

  return (
    <div className="p-4">
      <LoadPromise
        dependencies={[projectId, props.id]}
        promise={() => DocumentsAPI(projectId).show(props.id)}

        success={doc => <DocumentEditor document={doc} fullHeight />}

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
