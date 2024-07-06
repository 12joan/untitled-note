import React, { ReactNode, useMemo } from 'react';
import { streamDocuments } from '~/lib/apis/document';
import { streamTags } from '~/lib/apis/tag';
import { AppContextProvider } from '~/lib/appContext';
import { dispatchGlobalEvent } from '~/lib/globalEvents';
import { Future, mapFuture, thenFuture } from '~/lib/monads';
import { useRecentlyViewedDocuments } from '~/lib/recentlyViewedDocuments';
import { PartialDocument, Project, Tag } from '~/lib/types';
import { useStream } from '~/lib/useStream';
import { useValueChanged } from '~/lib/useValueChanged';

export interface StreamProjectDataProps {
  project: Project;
  children: ReactNode;
}

export const StreamProjectData = ({
  project,
  children,
}: StreamProjectDataProps) => {
  const projectId = project.id;

  const recentlyViewedDocuments = useRecentlyViewedDocuments();

  const futureTags = useStream<Tag[]>(
    {
      getStream: (resolve) => streamTags(projectId, resolve),
      cacheKey: `project-tags-${projectId}`,
    },
    [projectId]
  );

  const futurePartialDocumentsIncludingBlank = useStream<PartialDocument[]>(
    {
      getStream: (resolve) =>
        streamDocuments(
          projectId,
          {
            sort_by: 'created_at',
            sort_order: 'desc',
          },
          resolve
        ),
      cacheKey: `project-documents-${projectId}`,
    },
    [projectId]
  );

  const futurePartialDocuments = useMemo(
    () =>
      mapFuture(futurePartialDocumentsIncludingBlank, (documents) =>
        documents.filter((doc) => !doc.blank)
      ),
    [futurePartialDocumentsIncludingBlank]
  );

  useValueChanged(
    futurePartialDocumentsIncludingBlank,
    (futurePrevious, futureCurrent) =>
      thenFuture(futurePrevious, (previous) =>
        thenFuture(futureCurrent, (current) => {
          // Optimisation: Assumes there won't be an addition and a deletion in the same update
          if (current.length >= previous.length) {
            return;
          }

          const deletedDocumentIds = previous
            .filter(
              (previousDocument) =>
                !current.find(
                  (currentDocument) =>
                    currentDocument.id === previousDocument.id
                )
            )
            .map((previousDocument) => previousDocument.id);

          deletedDocumentIds.forEach((deletedDocumentId) =>
            dispatchGlobalEvent('document:delete', {
              documentId: deletedDocumentId,
            })
          );
        })
      )
  );

  const futurePinnedDocuments = useMemo(
    () =>
      mapFuture(futurePartialDocuments, (documents) =>
        documents
          .filter((doc) => doc.pinned_at !== null)
          .sort(
            (a, b) =>
              new Date(a.pinned_at!).getTime() -
              new Date(b.pinned_at!).getTime()
          )
      ),
    [futurePartialDocuments]
  );

  const futureRecentlyViewedDocuments = useMemo(
    () =>
      mapFuture(
        futurePartialDocuments,
        (documents) =>
          recentlyViewedDocuments
            .map((documentId) =>
              documents.find(
                (partialDocument) => partialDocument.id === documentId
              )
            )
            .filter((doc) => doc !== undefined) as PartialDocument[]
      ),
    [futurePartialDocuments, recentlyViewedDocuments]
  );

  const futureRecentlyModifiedDocuments = useMemo(
    () =>
      mapFuture(futurePartialDocuments, (documents) =>
        documents.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
      ),
    [futurePartialDocuments]
  );

  const excludePinned = (futureDocs: Future<PartialDocument[]>) =>
    useMemo(
      () =>
        mapFuture(futureDocs, (docs) =>
          docs.filter((doc) => doc.pinned_at === null)
        ),
      [futureDocs]
    );

  const futureRecentlyViewedDocumentsExcludingPinned = excludePinned(
    futureRecentlyViewedDocuments
  );

  const futureRecentlyModifiedDocumentsExcludingPinned = excludePinned(
    futureRecentlyModifiedDocuments
  );

  return (
    <AppContextProvider
      projectId={projectId}
      project={project}
      futureTags={futureTags}
      futurePartialDocuments={futurePartialDocuments}
      futurePinnedDocuments={futurePinnedDocuments}
      futureRecentlyViewedDocuments={futureRecentlyViewedDocuments}
      futureRecentlyModifiedDocuments={futureRecentlyModifiedDocuments}
      futureRecentlyViewedDocumentsExcludingPinned={
        futureRecentlyViewedDocumentsExcludingPinned
      }
      futureRecentlyModifiedDocumentsExcludingPinned={
        futureRecentlyModifiedDocumentsExcludingPinned
      }
      children={children}
    />
  );
};
