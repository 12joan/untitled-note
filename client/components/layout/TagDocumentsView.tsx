import React from 'react'

import { useElementSize } from '~/lib/useElementSize'
import { useContext, ContextProvider } from '~/lib/context'
import { useTitle } from '~/lib/useTitle'
import { OverviewLink } from '~/lib/routes'
import { useStream } from '~/lib/useStream'
import { streamDocuments } from '~/lib/apis/document'
import { mapFuture, unwrapFuture, Future } from '~/lib/monads'
import { Tag, PartialDocument } from '~/lib/types'

import BackButton from '~/components/BackButton'
import { InlinePlaceholder } from '~/components/Placeholder'
import { Dropdown } from '~/components/Dropdown'
import TagMenu from '~/components/TagMenu'
import { DocumentIndex } from '~/components/DocumentIndex'
import LoadingView from '~/components/LoadingView'
import CaretDownIcon from '~/components/icons/CaretDownIcon'

export interface TagDocumentsViewProps {
  tagId: number
}

export const TagDocumentsView = ({ tagId }: TagDocumentsViewProps) => {
  const [{ width: viewWidth }, viewRef] = useElementSize()

  const { projectId, futureTags } = useContext() as {
    projectId: number,
    futureTags: Future<Tag[]>
  }

  const futureTag: Future<Tag | undefined> = mapFuture(
    futureTags,
    (tags) => tags.find(tag => tag.id === tagId)
  )

  const futureDocuments: Future<PartialDocument[]> = mapFuture(
    useStream<PartialDocument[]>((callback) => streamDocuments({
      projectId,
      params: { tag_id: tagId },
      callback
    }), [tagId]),
    (documents) => documents.filter(doc => !doc.blank)
  )

  useTitle(unwrapFuture(futureTag, {
    pending: undefined,
    resolved: (tag) => tag?.text,
  }))

  if (unwrapFuture(futureTag, { pending: false, resolved: Boolean })) {
    return (
      <div className="space-y-3">
        <h1 className="h1">Tag not found</h1>
        <p className="text-lg font-light">This tag does not exist. Tags are automatically deleted when no documents are tagged with them.</p>
        <p><OverviewLink to={{}} className="btn btn-link">Go back</OverviewLink></p>
      </div>
    )
  }

  return (
    <div ref={viewRef} className="grow flex flex-col">
      <BackButton className="mb-3" />

      <div className="mb-5">
        {unwrapFuture(futureTag, {
          pending: (
            <h1 className="h1 select-none">
              <InlinePlaceholder />
            </h1>
          ),
          resolved: (tag) => (
            <Dropdown items={<TagMenu tag={tag} />} placement="bottom-start">
              <button type="button" className="btn btn-link-subtle text-left flex items-center">
                <h1 className="h1">Tag: {tag!.text}</h1>

                <CaretDownIcon noAriaLabel className="ml-1 translate-y-1 shrink-0" />
              </button>
            </Dropdown>
          ),
        })}
      </div>

      <ContextProvider
        linkOriginator={unwrapFuture(futureTag, {
          pending: 'Tag',
          resolved: (tag) => tag!.text,
        })}
      >
        {unwrapFuture(futureDocuments, {
          pending: <LoadingView />,
          resolved: (documents) => (
            <DocumentIndex
              viewWidth={viewWidth}
              documents={documents}
            />
          ),
        })}
      </ContextProvider>
    </div>
  )
}
