import React, { useRef, useMemo } from 'react'

import { useContext } from '~/lib/context'
import { RecentlyViewedDocumentLink, RecentlyViewedLink } from '~/lib/routes'
import useElementSize from '~/lib/useElementSize'

import { InlinePlaceholder } from '~/components/Placeholder'
import FutureDocumentIndex from '~/components/FutureDocumentIndex'
import PinnedDragTarget from '~/components/PinnedDragTarget'

const OverviewView = () => {
  const viewRef = useRef()
  const { width: viewWidth } = useElementSize(viewRef)

  const {
    futureProject,
    futurePartialDocuments,
    futurePinnedDocuments,
    futureRecentlyViewedDocuments,
  } = useContext()

  return (
    <div ref={viewRef} className="space-y-5">
      <h1 className="text-3xl font-medium">
        {futureProject.map(project => project.name).orDefault(<InlinePlaceholder />)}
      </h1>

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
        futureDocuments={futureRecentlyViewedDocuments.map(xs => xs.slice(0, 5))}
        linkComponent={RecentlyViewedDocumentLink}
      />

      {/*<Section
        title="Tags"
        cardsPerRow={cardsPerRow}
        showAllButton={true}
        items={['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8']}
      />*/}

      <FutureDocumentIndex
        viewWidth={viewWidth}
        title="All documents"
        futureDocuments={futurePartialDocuments}
      />
    </div>
  )
}

export default OverviewView
