import React, { useRef } from 'react'

import useElementSize from '~/lib/useElementSize'
import { useContext, ContextProvider } from '~/lib/context'
import useTitle from '~/lib/useTitle'
import { ProjectLink } from '~/lib/routes'
import useStream from '~/lib/useStream'
import DocumentsStream from '~/lib/streams/DocumentsStream'

import BackButton from '~/components/BackButton'
import { InlinePlaceholder } from '~/components/Placeholder'
import FutureDocumentIndex from '~/components/FutureDocumentIndex'

const TagDocumentsView = ({ tagId }) => {
  const viewRef = useRef()
  const { width: viewWidth } = useElementSize(viewRef)

  const { projectId, futureTags } = useContext()

  const futureTag = futureTags.map(tags => tags.find(tag => tag.id === tagId))

  const futureDocuments = useStream(resolve => DocumentsStream(projectId).index({ tag_id: tagId }, resolve), [tagId])

  useTitle(futureTag.map(tag => tag?.text).orDefault(undefined))

  if (futureTag.map(tag => tag === undefined).orDefault(false)) {
    return (
      <div className="space-y-3">
        <h1 className="text-3xl font-medium">Tag not found</h1>
        <p className="text-lg font-light">This tag does not exist. Tags are automatically deleted when no documents are tagged with them.</p>
        <p><ProjectLink className="btn btn-link">Go back</ProjectLink></p>
      </div>
    )
  }

  return (
    <div ref={viewRef}>
      <BackButton className="mb-3" />

      <h1 className="text-3xl font-medium select-none mb-5">
        {futureTag.map(tag => `Tagged: ${tag.text}`).orDefault(<InlinePlaceholder />)}
      </h1>

      <ContextProvider linkOriginator={futureTag.map(tag => tag.text).orDefault('Tag')}>
        <FutureDocumentIndex
          viewWidth={viewWidth}
          futureDocuments={futureDocuments}
          placeholders={4}
        />
      </ContextProvider>
    </div>
  )
}

export default TagDocumentsView
