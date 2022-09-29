import React, { useRef } from 'react'

import useElementSize from '~/lib/useElementSize'
import { useContext } from '~/lib/context'
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
  const futureHeading = futureTag.map(tag => `Tagged: ${tag?.text}`)

  const futureDocuments = useStream(resolve => DocumentsStream(projectId).index({ tag_id: tagId }, resolve), [tagId])

  if (futureTag.unwrap({ pending: () => false, resolved: tag => tag === undefined })) {
    return (
      <div className="space-y-3">
        <h1 className="text-3xl font-medium">Tag not found</h1>
        <p className="text-lg font-light">This tag does not exist. Tags are automatically deleted when no documents are tagged with them.</p>
        <p><ProjectLink className="btn btn-link">Go back</ProjectLink></p>
      </div>
    )
  }

  // TODO: Add link originator
  return (
    <div ref={viewRef}>
      <BackButton className="mb-3" />

      <h1 className="text-3xl font-medium select-none mb-5">
        {futureHeading.orDefault(<InlinePlaceholder />)}
      </h1>

      <FutureDocumentIndex
        viewWidth={viewWidth}
        futureDocuments={futureDocuments}
        placeholders={4}
      />
    </div>
  )
}

export default TagDocumentsView
