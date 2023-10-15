import React, { memo } from 'react';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import { unwrapFuture } from '~/lib/monads';
import { useElementSize } from '~/lib/useElementSize';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { LoadingView } from '~/components/LoadingView';
import { TagIndex } from '~/components/TagIndex';

export const AllTagsView = memo(() => {
  const [{ width: viewWidth }, viewRef] = useElementSize();
  const futureTags = useAppContext('futureTags');

  useTitle('All tags');

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <h1 className="h1 select-none mb-5">All tags</h1>

      <AppContextProvider linkOriginator="All tags">
        {unwrapFuture(futureTags, {
          pending: <LoadingView />,
          resolved: (tags) => (
            <TagIndex
              viewWidth={viewWidth}
              tags={tags}
              ifEmpty={
                <div className="bg-plain-100 dark:bg-plain-800 rounded-lg p-5 select-none">
                  There are no tags yet. Open a document and click the tag icon
                  to add a tag.
                </div>
              }
            />
          ),
        })}
      </AppContextProvider>
    </div>
  );
});
