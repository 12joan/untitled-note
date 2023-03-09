import React, { useMemo } from 'react'
import { Navigate } from 'react-router-dom'

import { useContext, ContextProvider } from '~/lib/context'
import { useRecentlyViewedDocuments } from '~/lib/recentlyViewedDocuments'
import { removeProjectFromHistory } from '~/lib/projectHistory'
import useStream from '~/lib/useStream'
import DocumentsStream from '~/lib/streams/DocumentsStream'
import TagsStream from '~/lib/streams/TagsStream'
import useValueChanged from '~/lib/useValueChanged'
import { dispatchGlobalEvent } from '~/lib/globalEvents'

const StreamProjectData = ({ projectId, children }) => {
  const { projects } = useContext()
  const project = useMemo(() => projects.find(project => project.id === projectId), [projects, projectId])

  const recentlyViewedDocuments = useRecentlyViewedDocuments()

  const futureTags = useStream(resolve => TagsStream(projectId).index({}, resolve), [projectId])

  const futurePartialDocumentsIncludingBlank = useStream(resolve => DocumentsStream(projectId).index({
    query: {
      id: true,
      title: true,
      safe_title: true,
      preview: true,
      blank: true,
      updated_by: true,
      updated_at: true,
      pinned_at: true,
    },
    sort_by: 'created_at',
    sort_order: 'desc',
  }, resolve), [projectId])

  const futurePartialDocuments = useMemo(() => futurePartialDocumentsIncludingBlank.map(
    documents => documents.filter(doc => !doc.blank)
  ), [futurePartialDocumentsIncludingBlank])

  useValueChanged(futurePartialDocumentsIncludingBlank, (futurePrevious, futureCurrent) => (
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

  const futurePinnedDocuments = useMemo(() => futurePartialDocuments.map(partialDocuments => (
    partialDocuments.filter(doc => doc.pinned_at !== null).sort((a, b) => new Date(a.pinned_at) - new Date(b.pinned_at))
  )), [futurePartialDocuments])

  const futureRecentlyViewedDocuments = useMemo(() => futurePartialDocuments.map(partialDocuments => (
    recentlyViewedDocuments
      .map(documentId => partialDocuments.find(partialDocument => partialDocument.id === documentId))
      .filter(doc => doc !== undefined && doc.pinned_at === null)
  )), [futurePartialDocuments, recentlyViewedDocuments])

  if (project === undefined) {
    removeProjectFromHistory(projectId)
    return <Navigate to="/" replace />
  }

  return (
    <ContextProvider
      projectId={projectId}
      project={project}
      futureTags={futureTags}
      futurePartialDocumentsIncludingBlank={futurePartialDocumentsIncludingBlank}
      futurePartialDocuments={futurePartialDocuments}
      futurePinnedDocuments={futurePinnedDocuments}
      futureRecentlyViewedDocuments={futureRecentlyViewedDocuments}
      children={children}
    />
  )
}

export default StreamProjectData
