import React from 'react'
import { useElementSize } from 'usehooks-ts'

import useTitle from '~/lib/useTitle'
import { useContext, ContextProvider } from '~/lib/context'
import { RecentlyViewedDocumentLink } from '~/lib/routes'

import BackButton from '~/components/BackButton'
import DocumentIndex from '~/components/DocumentIndex'
import LoadingView from '~/components/LoadingView'

const RecentlyViewedView = () => {
  const [viewRef, { width: viewWidth }] = useElementSize()

  useTitle('Recently viewed')

  const { futureRecentlyViewedDocuments } = useContext()

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <h1 className="text-3xl font-medium select-none mb-5">Recently viewed</h1>

      <ContextProvider linkOriginator="Recently viewed">
        {futureRecentlyViewedDocuments.map(documents => (
          <DocumentIndex
            viewWidth={viewWidth}
            documents={documents}
            linkComponent={RecentlyViewedDocumentLink}
            ifEmpty={(
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-5 select-none">
                No recently viewed documents
              </div>
            )}
          />
        )).orDefault(<LoadingView />)}
      </ContextProvider>
    </div>
  )
}

export default RecentlyViewedView
