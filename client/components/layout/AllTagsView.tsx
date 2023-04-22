import React from 'react';
import { ContextProvider, useContext } from '~/lib/context';
import { Future, unwrapFuture } from '~/lib/monads';
import { Tag } from '~/lib/types';
import { useElementSize } from '~/lib/useElementSize';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { LoadingView } from '~/components/LoadingView';
import { TagIndex } from '~/components/TagIndex';

export const AllTagsView = () => {
  const [{ width: viewWidth }, viewRef] = useElementSize();

  useTitle('All tags');

  const { futureTags } = useContext() as {
    futureTags: Future<Tag[]>;
  };

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <h1 className="h1 select-none mb-5">All tags</h1>

      <ContextProvider linkOriginator="All tags">
        {unwrapFuture(futureTags, {
          pending: <LoadingView />,
          resolved: (tags) => (
            <TagIndex
              viewWidth={viewWidth}
              tags={tags}
              ifEmpty={
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-5 select-none">
                  There are no tags yet. Open a document and click the tag icon
                  to add a tag.
                </div>
              }
            />
          ),
        })}
      </ContextProvider>
    </div>
  );
};
