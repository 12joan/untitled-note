import React, { memo } from 'react';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { sequenceFutures, unwrapFuture } from '~/lib/monads';
import {
  RecentlyModifiedLink,
  RecentlyViewedDocumentLink,
  RecentlyViewedLink,
  TagsLink,
} from '~/lib/routes';
import { useSettings } from '~/lib/settings';
import { useElementSize } from '~/lib/useElementSize';
import { useTitle } from '~/lib/useTitle';
import { DocumentIndex } from '~/components/DocumentIndex';
import { LoadingView } from '~/components/LoadingView';
import { NewDocumentRectButton } from '~/components/NewDocumentRectButton';
import { NoDocumentsView } from '~/components/NoDocumentsView';
import { PinnedDragTarget } from '~/components/PinnedDragTarget';
import { ProjectIcon } from '~/components/ProjectIcon';
import { QuickFind } from '~/components/QuickFind';
import { TagIndex } from '~/components/TagIndex';

export const OverviewView = memo(() => {
  const [{ width: viewWidth }, viewRef] = useElementSize();

  const [recentsType] = useSettings('recents_type');
  const project = useAppContext('project');
  const futurePartialDocuments = useAppContext('futurePartialDocuments');
  const futurePinnedDocuments = useAppContext('futurePinnedDocuments');
  const futureRecentlyViewedDocuments = useAppContext(
    'futureRecentlyViewedDocumentsExcludingPinned'
  );
  const futureRecentlyModifiedDocuments = useAppContext(
    'futureRecentlyModifiedDocumentsExcludingPinned'
  );
  const futureTags = useAppContext('futureTags');
  const toggleProjectSettingsModal = useAppContext(
    'toggleProjectSettingsModal'
  );

  useTitle(project.name);

  const futures = sequenceFutures({
    documents: futurePartialDocuments,
    pinnedDocuments: futurePinnedDocuments,
    recentlyViewedDocuments: futureRecentlyViewedDocuments,
    recentlyModifiedDocuments: futureRecentlyModifiedDocuments,
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
            <button
              type="button"
              className="btn btn-rect btn-secondary"
              onClick={() => toggleProjectSettingsModal()}
            >
              Project settings
            </button>
          </div>
        </div>
      </div>

      <QuickFind />

      {unwrapFuture(futures, {
        pending: <LoadingView />,
        resolved: ({
          documents,
          pinnedDocuments,
          recentlyViewedDocuments,
          recentlyModifiedDocuments,
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

            {recentsType === 'viewed' ? (
              <DocumentIndex
                viewWidth={viewWidth}
                title="Recently viewed"
                showAllLink={RecentlyViewedLink}
                documents={recentlyViewedDocuments.slice(0, 5)}
                linkComponent={RecentlyViewedDocumentLink}
              />
            ) : (
              <DocumentIndex
                viewWidth={viewWidth}
                title="Recently modified"
                showAllLink={RecentlyModifiedLink}
                documents={recentlyModifiedDocuments.slice(0, 5)}
              />
            )}

            <TagIndex
              viewWidth={viewWidth}
              title="Tags"
              showAllLink={TagsLink}
              tags={tags.slice(0, 5)}
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
