import React from 'react'
import { useElementSize } from 'usehooks-ts'

import { useContext, ContextProvider } from '~/lib/context'
import {
  EditProjectLink,
  RecentlyViewedLink,
  RecentlyViewedDocumentLink,
  TagsLink,
} from '~/lib/routes'
import useTitle from '~/lib/useTitle'
import { sequence, Future } from '~/lib/future'
import {
  TOP_N_RECENTLY_VIEWED_DOCUMENTS,
  TOP_N_TAGS,
} from '~/lib/config'

import PopOutLink from '~/components/PopOutLink'
import DocumentIndex from '~/components/DocumentIndex'
import TagIndex from '~/components/TagIndex'
import PinnedDragTarget from '~/components/PinnedDragTarget'
import NoDocumentsView from '~/components/NoDocumentsView'
import LoadingView from '~/components/LoadingView'

// TODO: Delete me
import TestUploads from '~/components/TestUploads'

const OverviewView = () => {
  const [viewRef, { width: viewWidth }] = useElementSize()

  const {
    project,
    futurePartialDocuments,
    futurePinnedDocuments,
    futureRecentlyViewedDocuments,
    futureTags,
  } = useContext()

  useTitle(project.name)

  const futures = sequence({
    documents: futurePartialDocuments,
    pinnedDocuments: futurePinnedDocuments,
    recentlyViewedDocuments: futureRecentlyViewedDocuments,
    tags: futureTags,
  }, Future.resolved)

  return (
    <div ref={viewRef} className="grow flex flex-col gap-5">
      <PopOutLink as={EditProjectLink} label="Edit details">
        <h1 className="text-3xl font-medium">
          {project.name}
        </h1>
      </PopOutLink>

      <TestUploads />

      {futures.map(({ documents, pinnedDocuments, recentlyViewedDocuments, tags }) => (
        <ContextProvider linkOriginator="Overview">
          <DocumentIndex
            viewWidth={viewWidth}
            title="Pinned documents"
            documents={pinnedDocuments}
            render={children => (
              <PinnedDragTarget>
                {children}
              </PinnedDragTarget>
            )}
          />

          <DocumentIndex
            viewWidth={viewWidth}
            title="Recently viewed"
            showAllLink={RecentlyViewedLink}
            documents={recentlyViewedDocuments.slice(0, TOP_N_RECENTLY_VIEWED_DOCUMENTS)}
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
      )).orDefault(<LoadingView />)}
    </div>
  )
}

export default OverviewView
