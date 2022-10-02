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
import {
  TOP_N_RECENTLY_VIEWED_DOCUMENTS,
  TOP_N_TAGS,
} from '~/lib/config'

import PopOutLink from '~/components/PopOutLink'
import { InlinePlaceholder } from '~/components/Placeholder'
import FutureDocumentIndex from '~/components/FutureDocumentIndex'
import FutureTagIndex from '~/components/FutureTagIndex'
import PinnedDragTarget from '~/components/PinnedDragTarget'
import NoDocumentsView from '~/components/NoDocumentsView'

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

  return (
    <div ref={viewRef} className="space-y-5">
      <PopOutLink as={EditProjectLink} label="Edit details">
        <h1 className="text-3xl font-medium">
          {futureProject.map(project => project.name).orDefault(<InlinePlaceholder />)}
        </h1>
      </PopOutLink>

      <ContextProvider linkOriginator="Overview">
        <PinnedDragTarget>
          <FutureDocumentIndex
            viewWidth={viewWidth}
            title="Pinned documents"
            futureDocuments={futurePinnedDocuments}
          />
        </PinnedDragTarget>

        <FutureDocumentIndex
          viewWidth={viewWidth}
          title="Recently viewed"
          showAllLink={RecentlyViewedLink}
          futureDocuments={futureRecentlyViewedDocuments.map(xs => xs.slice(0, TOP_N_RECENTLY_VIEWED_DOCUMENTS))}
          linkComponent={RecentlyViewedDocumentLink}
        />

        <FutureTagIndex
          viewWidth={viewWidth}
          title="Tags"
          showAllLink={TagsLink}
          futureTags={futureTags.map(xs => xs.slice(0, TOP_N_TAGS))}
        />

        <FutureDocumentIndex
          viewWidth={viewWidth}
          title="All documents"
          futureDocuments={futurePartialDocuments}
          placeholders={4}
          ifEmpty={<NoDocumentsView />}
        />
      </ContextProvider>
    </div>
  )
}

export default OverviewView
