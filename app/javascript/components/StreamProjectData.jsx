import React from 'react'
import { Navigate } from 'react-router-dom'

import useStream from '~/lib/useStream'
import ProjectsStream from '~/lib/streams/ProjectsStream'
import DocumentsStream from '~/lib/streams/DocumentsStream'
import useValueChanged from '~/lib/useValueChanged'
import { dispatchGlobalEvent } from '~/lib/globalEvents'
import { projectPath } from '~/lib/routes'
import { ContextProvider } from '~/lib/context'

const StreamProjectData = ({ projectId, children }) => {
  const futureProjects = useStream(resolve => ProjectsStream.index({}, resolve), [])
  const futureProject = futureProjects.map(projects => projects.find(project => project.id == projectId))

  const futurePartialDocuments = useStream(resolve => 
    DocumentsStream(projectId).index({
      query: {
        id: true,
        remote_version: true,
        safe_title: true,
        preview: true,
        pinned_at: true,
      },
      sort_by: 'created_at',
      sort_order: 'desc',
    }, resolve),
    [projectId]
  )

  useValueChanged(futurePartialDocuments, (futurePrevious, futureCurrent) => (
    futurePrevious.bind(previous => futureCurrent.bind(current => {
      // Optimisation: Assumes there won't be an addition and a deletion in the same update
      if (current.length >= previous.length) {
        return
      }

      const deletedDocumentIds = previous.filter(previousDocument => (
        !current.find(currentDocument => currentDocument.id === previousDocument.id)
      )).map(previousDocument => previousDocument.id)

      deletedDocumentIds.forEach(deletedDocumentId => dispatchGlobalEvent('document:delete', { documentId: deletedDocumentId }))
    }))
  ))

  const futurePinnedDocuments = futurePartialDocuments.map(partialDocuments =>
    partialDocuments.filter(doc => doc.pinned_at !== null).sort((a, b) => new Date(a.pinned_at) - new Date(b.pinned_at))
  )

  if (futureProject.isResolved && futureProject.data === undefined) {
    const [firstProject] = futureProjects.data
    return <Navigate to={projectPath(firstProject.id)} />
  }

  return (
    <ContextProvider
      projectId={projectId}
      futureProjects={futureProjects}
      futureProject={futureProject}
      futurePartialDocuments={futurePartialDocuments}
      futurePinnedDocuments={futurePinnedDocuments}
      children={children}
    />
  )
}

export default StreamProjectData
