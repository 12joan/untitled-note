import React from 'react'
import { useContext  } from 'react'
import useLocalStorage from 'react-use-localstorage'
import ProjectContext from 'lib/contexts/ProjectContext'
import ContentArea from 'components/layout/ContentArea'
import LinkSelect from 'components/LinkSelect'
import LoadPromise from 'components/LoadPromise'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import DocumentEditor from 'components/documents/DocumentEditor'

const DocumentIndex = props => {
  const { id: projectId } = useContext(ProjectContext)

  const [sortParameter, setSortParameter] = useLocalStorage('document-index-sort-parameter', 'created_at')

  const sortingControls = (
    <>
      Sort by
      {' '}
      <LinkSelect
        value={sortParameter}
        onChange={setSortParameter}
        options={{
          'created_at': 'recently created',
          'updated_at': 'recently updated',
        }} />
    </>
  )

  return (
    <ContentArea sortingControls={sortingControls}>
      <div className="h-100 d-flex">
        <div className="h-100 flex-grow-1 overflow-scroll d-flex flex-column-reverse px-4 pt-4 mb-n4">
          <div>
            <LoadPromise
              dependencies={[projectId, sortParameter]}
              promise={() => DocumentsAPI(projectId).index({
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
    </ContentArea>
  )
}

export default DocumentIndex
