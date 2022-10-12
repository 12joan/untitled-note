import React from 'react'
import { useElementSize } from 'usehooks-ts'

import useTitle from '~/lib/useTitle'
import { useContext, ContextProvider } from '~/lib/context'

import BackButton from '~/components/BackButton'
import TagIndex from '~/components/TagIndex'
import LoadingView from '~/components/LoadingView'

const AllTagsView = () => {
  const [viewRef, { width: viewWidth }] = useElementSize()

  useTitle('All tags')

  const { futureTags } = useContext()

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <h1 className="text-3xl font-medium select-none mb-5">All tags</h1>

      <ContextProvider linkOriginator="All tags">
        {futureTags.map(tags => (
          <TagIndex
            viewWidth={viewWidth}
            tags={tags}
            ifEmpty={(
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-5 select-none">
                There are no tags yet. Open a document and click the tag icon to add a tag.
              </div>
            )}
          />
        )).orDefault(<LoadingView />)}
      </ContextProvider>
    </div>
  )
}

export default AllTagsView
