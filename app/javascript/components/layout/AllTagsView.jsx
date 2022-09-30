import React, { useRef } from 'react'

import useElementSize from '~/lib/useElementSize'
import useTitle from '~/lib/useTitle'
import { useContext, ContextProvider } from '~/lib/context'

import BackButton from '~/components/BackButton'
import FutureTagIndex from '~/components/FutureTagIndex'

const AllTagsView = () => {
  const viewRef = useRef()
  const { width: viewWidth } = useElementSize(viewRef)

  useTitle('All tags')

  const { futureTags } = useContext()

  return (
    <div ref={viewRef}>
      <BackButton className="mb-3" />

      <h1 className="text-3xl font-medium select-none mb-5">All tags</h1>

      <ContextProvider linkOriginator="All tags">
        <FutureTagIndex
          viewWidth={viewWidth}
          futureTags={futureTags}
          placeholders={4}
          ifEmpty={(
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-5 select-none">
              There are no tags yet. Open a document and click the tag icon to add a tag.
            </div>
          )}
        />
      </ContextProvider>
    </div>
  )
}

export default AllTagsView
