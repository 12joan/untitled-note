import React, { useRef } from 'react'

import { useContext, ContextProvider } from '~/lib/context'
import {
  EditProjectLink,
  RecentlyViewedLink,
  RecentlyViewedDocumentLink,
  TagsLink,
} from '~/lib/routes'
import useElementSize from '~/lib/useElementSize'
import useTitle from '~/lib/useTitle'
import { sequence, Future } from '~/lib/future'
import {
  TOP_N_RECENTLY_VIEWED_DOCUMENTS,
  TOP_N_TAGS,
} from '~/lib/config'

import PopOutLink from '~/components/PopOutLink'
import { InlinePlaceholder } from '~/components/Placeholder'
import DocumentIndex from '~/components/DocumentIndex'
import TagIndex from '~/components/TagIndex'
import PinnedDragTarget from '~/components/PinnedDragTarget'
import NoDocumentsView from '~/components/NoDocumentsView'
import LoadingView from '~/components/LoadingView'

const OverviewView = () => {
  const viewRef = useRef()
  const { width: viewWidth } = useElementSize(viewRef)

  const {
    futureProject,
    futurePartialDocuments,
    futurePinnedDocuments,
    futureRecentlyViewedDocuments,
    futureTags,
  } = useContext()

  useTitle(futureProject.map(project => project.name).orDefault(undefined))

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
          {futureProject.map(project => project.name).orDefault(<InlinePlaceholder />)}
        </h1>
      </PopOutLink>

      {futures.map(({ documents, pinnedDocuments, recentlyViewedDocuments, tags }) => (
        <ContextProvider linkOriginator="Overview">
          <PinnedDragTarget>
            <DocumentIndex
              viewWidth={viewWidth}
              title="Pinned documents"
              documents={pinnedDocuments}
            />
          </PinnedDragTarget>

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
