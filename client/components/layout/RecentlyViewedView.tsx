import React, { memo } from 'react';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { unwrapFuture } from '~/lib/monads';
import { RecentlyViewedDocumentLink } from '~/lib/routes';
import { useElementSize } from '~/lib/useElementSize';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { DocumentIndex } from '~/components/DocumentIndex';
import { LoadingView } from '~/components/LoadingView';

export const RecentlyViewedView = memo(() => {
  const [{ width: viewWidth }, viewRef] = useElementSize();

  useTitle('Recently viewed');

  const futureRecentlyViewedDocuments = useAppContext(
    'futureRecentlyViewedDocuments'
  );

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <h1 className="h1 select-none mb-5">Recently viewed</h1>

      <AppContextProvider linkOriginator="Recently viewed">
        {unwrapFuture(futureRecentlyViewedDocuments, {
          pending: <LoadingView />,
          resolved: (documents) => (
            <DocumentIndex
              viewWidth={viewWidth}
              documents={documents}
              linkComponent={RecentlyViewedDocumentLink}
              ifEmpty={
                <div className="bg-plain-100 dark:bg-plain-800 rounded-lg p-5 select-none">
                  No recently viewed documents
                </div>
              }
            />
          ),
        })}
      </AppContextProvider>
    </div>
  );
});
