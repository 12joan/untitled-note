import React from 'react'
import { useElementSize } from 'usehooks-ts'

import { useContext, ContextProvider } from '~/lib/context'
import useTitle from '~/lib/useTitle'
import { OverviewLink } from '~/lib/routes'
import useStream from '~/lib/useStream'
import DocumentsStream from '~/lib/streams/DocumentsStream'

import BackButton from '~/components/BackButton'
import { InlinePlaceholder } from '~/components/Placeholder'
import Dropdown from '~/components/Dropdown'
import TagMenu from '~/components/TagMenu'
import DocumentIndex from '~/components/DocumentIndex'
import LoadingView from '~/components/LoadingView'
import CaretDownIcon from '~/components/icons/CaretDownIcon'

const TagDocumentsView = ({ tagId }) => {
  const [viewRef, { width: viewWidth }] = useElementSize()

  const { projectId, futureTags } = useContext()

  const futureTag = futureTags.map(tags => tags.find(tag => tag.id === tagId))

  const futureDocuments = useStream(
    resolve => DocumentsStream(projectId).index({ tag_id: tagId }, resolve),
    [tagId]
  ).map(documents => documents.filter(doc => !doc.blank))

  useTitle(futureTag.map(tag => tag?.text).orDefault(undefined))

  if (futureTag.map(tag => tag === undefined).orDefault(false)) {
    return (
      <div className="space-y-3">
        <h1 className="h1">Tag not found</h1>
        <p className="text-lg font-light">This tag does not exist. Tags are automatically deleted when no documents are tagged with them.</p>
        <p><OverviewLink className="btn btn-link">Go back</OverviewLink></p>
      </div>
    )
  }

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <div className="mb-5">
        {futureTag.map(tag => (
          <Dropdown items={<TagMenu tag={tag} />} placement="bottom-start">
            <button type="button" className="btn btn-link-subtle text-left flex items-center">
              <h1 className="h1">Tag: {tag.text}</h1>

              <CaretDownIcon noAriaLabel className="ml-1 translate-y-1 shrink-0" />
            </button>
          </Dropdown>
        )).orDefault(
          <h1 className="h1 select-none">
            <InlinePlaceholder />
          </h1>
        )}
      </div>

      <ContextProvider linkOriginator={futureTag.map(tag => tag.text).orDefault('Tag')}>
        {futureDocuments.map(documents => (
          <DocumentIndex
            viewWidth={viewWidth}
            documents={documents}
          />
        )).orDefault(<LoadingView />)}
      </ContextProvider>
    </div>
  )
}

export default TagDocumentsView
