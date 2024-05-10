import React, { memo } from 'react';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { unwrapFuture } from '~/lib/monads';
import { useElementSize } from '~/lib/useElementSize';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { DocumentIndex } from '~/components/DocumentIndex';
import { LoadingView } from '~/components/LoadingView';

export const RecentlyModifiedView = memo(() => {
  const [{ width: viewWidth }, viewRef] = useElementSize();

  useTitle('Recently modified');

  const futureRecentlyModifiedDocuments = useAppContext(
    'futureRecentlyModifiedDocuments'
  );

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <h1 className="h1 select-none mb-5">Recently modified</h1>

      <AppContextProvider linkOriginator="Recently modified">
        {unwrapFuture(futureRecentlyModifiedDocuments, {
          pending: <LoadingView />,
          resolved: (documents) => (
            <DocumentIndex
              viewWidth={viewWidth}
              documents={documents}
              ifEmpty={
                <div className="bg-plain-100 dark:bg-plain-800 rounded-lg p-5 select-none">
                  No recently modified documents
                </div>
              }
            />
          ),
        })}
      </AppContextProvider>
    </div>
  );
});
