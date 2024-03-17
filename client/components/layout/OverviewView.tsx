import React, { memo } from 'react';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { TOP_N_RECENTLY_VIEWED_DOCUMENTS, TOP_N_TAGS } from '~/lib/config';
import { sequenceFutures, unwrapFuture } from '~/lib/monads';
import {
  EditProjectLink,
  RecentlyViewedDocumentLink,
  RecentlyViewedLink,
  TagsLink,
} from '~/lib/routes';
import { useElementSize } from '~/lib/useElementSize';
import { useTitle } from '~/lib/useTitle';
import { DocumentIndex } from '~/components/DocumentIndex';
import { LoadingView } from '~/components/LoadingView';
import { NoDocumentsView } from '~/components/NoDocumentsView';
import { PinnedDragTarget } from '~/components/PinnedDragTarget';
import { TagIndex } from '~/components/TagIndex';
import { NewDocumentRectButton } from '../NewDocumentRectButton';
import { ProjectIcon } from '../ProjectIcon';

export const OverviewView = memo(() => {
  const [{ width: viewWidth }, viewRef] = useElementSize();

  const project = useAppContext('project');
  const futurePartialDocuments = useAppContext('futurePartialDocuments');
  const futurePinnedDocuments = useAppContext('futurePinnedDocuments');
  const futureRecentlyViewedDocuments = useAppContext(
    'futureRecentlyViewedDocuments'
  );
  const futureTags = useAppContext('futureTags');

  useTitle(project.name);

  const futures = sequenceFutures({
    documents: futurePartialDocuments,
    pinnedDocuments: futurePinnedDocuments,
    recentlyViewedDocuments: futureRecentlyViewedDocuments,
    tags: futureTags,
  });

  const projectIcon = (
    <ProjectIcon
      project={project}
      className="size-12 sm:size-[5.25rem] text-xl sm:text-4xl border dark:border-transparent rounded-lg sm:rounded-2xl select-none"
    />
  );

  return (
    <div ref={viewRef} className="grow flex flex-col gap-5">
      <div className="flex gap-3">
        <div className="max-sm:hidden" aria-hidden>
          {projectIcon}
        </div>

        <div className="space-y-2">
          <h1 className="h1 flex items-center gap-2">
            <div className="sm:hidden" aria-hidden>
              {projectIcon}
            </div>
            {project.name}
          </h1>
          <div className="flex gap-2 flex-wrap">
            <NewDocumentRectButton />
            <EditProjectLink className="btn btn-rect btn-secondary">
              Edit project
            </EditProjectLink>
          </div>
        </div>
      </div>

      <label className="block space-y-2">
        <h2 className="font-medium select-none">Quick search</h2>

        <input
          type="text"
          className="block w-full sm:max-w-lg border rounded-lg px-3 py-2 bg-page-bg-light dark:border-transparent dark:bg-plain-800 dark:focus:bg-page-bg-dark"
          placeholder="Find a document or tag"
        />
      </label>

      {unwrapFuture(futures, {
        pending: <LoadingView />,
        resolved: ({
          documents,
          pinnedDocuments,
          recentlyViewedDocuments,
          tags,
        }) => (
          <AppContextProvider linkOriginator="Overview">
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
          </AppContextProvider>
        ),
      })}
    </div>
  );
});
