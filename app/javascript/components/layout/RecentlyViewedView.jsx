import React, { useRef } from 'react'

import useElementSize from '~/lib/useElementSize'
import { useContext } from '~/lib/context'
import { RecentlyViewedDocumentLink } from '~/lib/routes'

import FutureDocumentIndex from '~/components/FutureDocumentIndex'

const RecentlyViewedView = () => {
  const viewRef = useRef()
  const { width: viewWidth } = useElementSize(viewRef)

  const { futureRecentlyViewedDocuments } = useContext()

  return (
    <div ref={viewRef} className="space-y-5">
      <h1 className="text-3xl font-medium select-none">Recently viewed</h1>

      <FutureDocumentIndex
        viewWidth={viewWidth}
        futureDocuments={futureRecentlyViewedDocuments}
        linkComponent={RecentlyViewedDocumentLink}
      />
    </div>
  )
}

export default RecentlyViewedView
