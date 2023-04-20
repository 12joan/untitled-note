import React from 'react'

import { useElementSize } from '~/lib/useElementSize'
import { useTitle } from '~/lib/useTitle'
import { useContext, ContextProvider } from '~/lib/context'
import { RecentlyViewedDocumentLink } from '~/lib/routes'
import { Future, unwrapFuture } from '~/lib/monads'
import { PartialDocument } from '~/lib/types'

import BackButton from '~/components/BackButton'
import DocumentIndex from '~/components/DocumentIndex'
import LoadingView from '~/components/LoadingView'

export const RecentlyViewedView = () => {
  const [{ width: viewWidth }, viewRef] = useElementSize()

  useTitle('Recently viewed')

  const { futureRecentlyViewedDocuments } = useContext() as {
    futureRecentlyViewedDocuments: Future<PartialDocument[]>
  }

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <h1 className="h1 select-none mb-5">Recently viewed</h1>

      <ContextProvider linkOriginator="Recently viewed">
        {unwrapFuture(futureRecentlyViewedDocuments, {
          pending: <LoadingView />,
          resolved: (documents) => (
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
          ),
        })}
      </ContextProvider>
    </div>
  )
}
