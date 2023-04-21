import React, { useMemo, ReactNode } from 'react'

import { ContextProvider } from '~/lib/context'
import { useRecentlyViewedDocuments } from '~/lib/recentlyViewedDocuments'
import { useStream } from '~/lib/useStream'
import { streamDocuments } from '~/lib/apis/document'
import { streamTags } from '~/lib/apis/tag'
import { useValueChanged } from '~/lib/useValueChanged'
import { dispatchGlobalEvent } from '~/lib/globalEvents'
import { Project, Tag, PartialDocument } from '~/lib/types'
import { mapFuture, thenFuture } from '~/lib/monads'

export interface StreamProjectDataProps {
  project: Project
  children: ReactNode
}

export const StreamProjectData = ({
  project,
  children,
}: StreamProjectDataProps) => {
  const projectId = project.id

  const recentlyViewedDocuments = useRecentlyViewedDocuments()

  const futureTags = useStream<Tag[]>((resolve) => (
    streamTags(projectId, resolve)
  ), [projectId])

  const futurePartialDocumentsIncludingBlank = useStream<PartialDocument[]>((resolve) => (
    streamDocuments(projectId, {
      sort_by: 'created_at',
      sort_order: 'desc',
    }, resolve)
  ), [projectId])

  const futurePartialDocuments = useMemo(() => (
    mapFuture(
      futurePartialDocumentsIncludingBlank,
      (documents) => documents.filter(doc => !doc.blank)
    )
  ), [futurePartialDocumentsIncludingBlank])

  useValueChanged(
    futurePartialDocumentsIncludingBlank,
    (futurePrevious, futureCurrent) => (
      thenFuture(futurePrevious, (previous) => (
        thenFuture(futureCurrent, (current) => {
          // Optimisation: Assumes there won't be an addition and a deletion in the same update
          if (current.length >= previous.length) {
            return
          }

          const deletedDocumentIds = previous.filter(previousDocument => (
            !current.find(currentDocument => (
              currentDocument.id === previousDocument.id
            ))
          )).map(previousDocument => previousDocument.id)

          deletedDocumentIds.forEach(deletedDocumentId => (
            dispatchGlobalEvent('document:delete', { documentId: deletedDocumentId })
          ))
        })
      ))
    )
  )

  const futurePinnedDocuments = useMemo(() => (
    mapFuture(
      futurePartialDocuments,
      (documents) => (documents
        .filter(doc => doc.pinned_at !== null)
        .sort((a, b) => new Date(a.pinned_at!).getTime() - new Date(b.pinned_at!).getTime())
      )
    )
  ), [futurePartialDocuments])

  const futureRecentlyViewedDocuments = useMemo(() => (
    mapFuture(
      futurePartialDocuments,
      (documents) => (recentlyViewedDocuments
        .map(documentId => documents.find(partialDocument => partialDocument.id === documentId))
        .filter(doc => doc !== undefined && doc.pinned_at === null)
      )
    )
  ), [futurePartialDocuments, recentlyViewedDocuments])

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
