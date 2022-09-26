import React, { useRef } from 'react'

import useElementSize from '~/lib/useElementSize'
import { useContext, ContextProvider } from '~/lib/context'
import { RecentlyViewedDocumentLink } from '~/lib/routes'

import BackButton from '~/components/BackButton'
import FutureDocumentIndex from '~/components/FutureDocumentIndex'

const RecentlyViewedView = () => {
  const viewRef = useRef()
  const { width: viewWidth } = useElementSize(viewRef)

  const { futureRecentlyViewedDocuments } = useContext()

  return (
    <div ref={viewRef}>
      <BackButton className="mb-3" />

      <h1 className="text-3xl font-medium select-none mb-5">Recently viewed</h1>

      <ContextProvider linkOriginator="recentlyViewed">
        <FutureDocumentIndex
          viewWidth={viewWidth}
          futureDocuments={futureRecentlyViewedDocuments}
          linkComponent={RecentlyViewedDocumentLink}
          placeholders={4}
        />
      </ContextProvider>
    </div>
  )
}

export default RecentlyViewedView
