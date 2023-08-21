import React from 'react';
import { streamDocuments } from '~/lib/apis/document';
import { ContextProvider, useContext } from '~/lib/context';
import { Future, mapFuture, unwrapFuture } from '~/lib/monads';
import { OverviewLink } from '~/lib/routes';
import { PartialDocument, Tag } from '~/lib/types';
import { useElementSize } from '~/lib/useElementSize';
import { useStream } from '~/lib/useStream';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { DocumentIndex } from '~/components/DocumentIndex';
import { Dropdown } from '~/components/Dropdown';
import CaretDownIcon from '~/components/icons/CaretDownIcon';
import { LoadingView } from '~/components/LoadingView';
import { InlinePlaceholder } from '~/components/Placeholder';
import { TagMenu } from '~/components/TagMenu';

export interface TagDocumentsViewProps {
  tagId: number;
}

export const TagDocumentsView = ({ tagId }: TagDocumentsViewProps) => {
  const [{ width: viewWidth }, viewRef] = useElementSize();

  const { projectId, futureTags } = useContext() as {
    projectId: number;
    futureTags: Future<Tag[]>;
  };

  const futureTag: Future<Tag | undefined> = mapFuture(futureTags, (tags) =>
    tags.find((tag) => tag.id === tagId)
  );

  const futureDocuments: Future<PartialDocument[]> = mapFuture(
    useStream<PartialDocument[]>(
      {
        getStream: (resolve) =>
          streamDocuments(
            projectId,
            {
              tag_id: tagId,
            },
            resolve
          ),
        cacheKey: `tag-documents-${tagId}`,
      },
      [tagId]
    ),
    (documents) => documents.filter((doc) => !doc.blank)
  );

  useTitle(
    unwrapFuture(futureTag, {
      pending: undefined,
      resolved: (tag) => tag?.text,
    })
  );

  const isNotFound = unwrapFuture(futureTag, {
    pending: false,
    resolved: (tag) => tag === undefined,
  });

  if (isNotFound) {
    return (
      <div className="space-y-3">
        <h1 className="h1">Tag not found</h1>
        <p className="text-lg font-light">
          This tag does not exist. Tags are automatically deleted when no
          documents are tagged with them.
        </p>
        <p>
          <OverviewLink className="btn btn-link">Go back</OverviewLink>
        </p>
      </div>
    );
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
            <Dropdown items={<TagMenu tag={tag!} />} placement="bottom-start">
              <button
                type="button"
                className="btn btn-link-subtle text-left flex items-center"
              >
                <h1 className="h1">Tag: {tag!.text}</h1>

                <CaretDownIcon
                  noAriaLabel
                  className="ml-1 translate-y-1 shrink-0"
                />
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
            <DocumentIndex viewWidth={viewWidth} documents={documents} />
          ),
        })}
      </ContextProvider>
    </div>
  );
};
