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

      <ContextProvider linkOriginator="Recently viewed">
        <FutureDocumentIndex
          viewWidth={viewWidth}
          futureDocuments={futureRecentlyViewedDocuments}
          linkComponent={RecentlyViewedDocumentLink}
          placeholders={4}
          ifEmpty={(
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-5 select-none">
              No recently viewed documents
            </div>
          )}
        />
      </ContextProvider>
    </div>
  )
}

export default RecentlyViewedView
