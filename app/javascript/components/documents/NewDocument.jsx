import React from 'react'
import { useContext } from 'react'
import ProjectContext from 'lib/contexts/ProjectContext'
import ContentArea from 'components/layout/ContentArea'
import RouteConfig from 'lib/RouteConfig'
import DocumentEditor from 'components/documents/DocumentEditor'

const NewDocument = props => {
  const { id: projectId } = useContext(ProjectContext)

  return (
    <ContentArea backButton={{
      label: 'All documents',
      url: RouteConfig.projects.show(projectId).documents.url,
      }}>
      <div className="p-4">
        <DocumentEditor document={{
          title: '',
          body: '',
          keywords: [],
        }} fullHeight openable />
      </div>
    </ContentArea>
  )
}

export default NewDocument
