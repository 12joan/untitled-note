import React from 'react';
import { TOP_N_RECENTLY_VIEWED_DOCUMENTS, TOP_N_TAGS } from '~/lib/config';
import { ContextProvider, useContext } from '~/lib/context';
import { Future, sequenceFutures, unwrapFuture } from '~/lib/monads';
import {
  EditProjectLink,
  RecentlyViewedDocumentLink,
  RecentlyViewedLink,
  TagsLink,
} from '~/lib/routes';
import { PartialDocument, Project, Tag } from '~/lib/types';
import { useElementSize } from '~/lib/useElementSize';
import { useTitle } from '~/lib/useTitle';
import { DocumentIndex } from '~/components/DocumentIndex';
import { LoadingView } from '~/components/LoadingView';
import { NoDocumentsView } from '~/components/NoDocumentsView';
import { PinnedDragTarget } from '~/components/PinnedDragTarget';
import { PopOutLink } from '~/components/PopOutLink';
import { TagIndex } from '~/components/TagIndex';

export const OverviewView = () => {
  const [{ width: viewWidth }, viewRef] = useElementSize();

  const {
    project,
    futurePartialDocuments,
    futurePinnedDocuments,
    futureRecentlyViewedDocuments,
    futureTags,
  } = useContext() as {
    project: Project;
    futurePartialDocuments: Future<PartialDocument[]>;
    futurePinnedDocuments: Future<PartialDocument[]>;
    futureRecentlyViewedDocuments: Future<PartialDocument[]>;
    futureTags: Future<Tag[]>;
  };

  useTitle(project.name);

  const futures = sequenceFutures({
    documents: futurePartialDocuments,
    pinnedDocuments: futurePinnedDocuments,
    recentlyViewedDocuments: futureRecentlyViewedDocuments,
    tags: futureTags,
  });

  return (
    <div ref={viewRef} className="grow flex flex-col gap-5">
      <PopOutLink as={EditProjectLink} label="Edit project">
        <h1 className="h1">{project.name}</h1>
      </PopOutLink>

      {unwrapFuture(futures, {
        pending: <LoadingView />,
        resolved: ({
          documents,
          pinnedDocuments,
          recentlyViewedDocuments,
          tags,
        }) => (
          <ContextProvider linkOriginator="Overview">
            <DocumentIndex
              viewWidth={viewWidth}
              title="Pinned documents"
              documents={pinnedDocuments}
              render={(children) => (
                <PinnedDragTarget>{children}</PinnedDragTarget>
              )}
            />

            <DocumentIndex
              viewWidth={viewWidth}
              title="Recently viewed"
              showAllLink={RecentlyViewedLink}
              documents={recentlyViewedDocuments.slice(
                0,
                TOP_N_RECENTLY_VIEWED_DOCUMENTS
              )}
              linkComponent={RecentlyViewedDocumentLink}
            />

            <TagIndex
              viewWidth={viewWidth}
              title="Tags"
              showAllLink={TagsLink}
              tags={tags.slice(0, TOP_N_TAGS)}
            />

            <DocumentIndex
              viewWidth={viewWidth}
              title="All documents"
              documents={documents}
              ifEmpty={<NoDocumentsView />}
            />
          </ContextProvider>
        ),
      })}
    </div>
  );
};
