import React from 'react';
import { streamSequenceBeforeAndAfter } from '~/lib/apis/tag';
import { useAppContext } from '~/lib/appContext';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { orDefaultFuture } from '~/lib/monads';
import { DocumentLink, NewDocumentLink } from '~/lib/routes';
import {
  LocalDocument,
  SequenceBeforeAndAfter as SequenceBeforeAndAfterType,
  Tag,
} from '~/lib/types';
import { useStream } from '~/lib/useStream';
import CaretLeftIcon from '~/components/icons/CaretLeftIcon';
import CaretRightIcon from '~/components/icons/CaretRightIcon';

export interface SequenceBeforeAndAfterProps {
  workingDocument: LocalDocument & {
    sequence_tag_id: Tag['id'];
  };
}

export const SequenceBeforeAndAfter = ({
  workingDocument,
}: SequenceBeforeAndAfterProps) => {
  const projectId = useAppContext('projectId');
  const {
    id: documentId,
    sequence_tag_id: sequenceTagId,
    blank,
  } = workingDocument;

  const futureBeforeAndAfter = useStream<SequenceBeforeAndAfterType>(
    {
      getStream: (resolve) =>
        streamSequenceBeforeAndAfter(
          projectId,
          sequenceTagId,
          documentId,
          resolve
        ),

      cacheKey: `sequence-${sequenceTagId}-${documentId}`,
    },
    [projectId, sequenceTagId, documentId]
  );

  const [before, after] = orDefaultFuture(
    futureBeforeAndAfter,
    workingDocument.sequence_before_and_after
  ) ?? [null, null];

  return (
    <div className="flex gap-2 flex-wrap lg:narrow">
      {before && (
        <BeforeAfterLink
          documentId={before.id}
          label={before.safe_title}
          direction="before"
        />
      )}

      {after ? (
        <BeforeAfterLink
          documentId={after.id}
          label={after.safe_title}
          direction="after"
        />
      ) : (
        !blank && (
          <NewDocumentLink
            to={{ tagId: sequenceTagId }}
            className="ml-auto btn btn-link font-medium flex items-center gap-1"
          >
            New document
            <CaretRightIcon noAriaLabel />
          </NewDocumentLink>
        )
      )}
    </div>
  );
};

interface BeforeAfterLinkProps {
  documentId: LocalDocument['id'];
  label: string;
  direction: 'before' | 'after';
}

const BeforeAfterLink = ({
  documentId,
  label,
  direction,
}: BeforeAfterLinkProps) => {
  return (
    <DocumentLink
      to={{ documentId }}
      className={groupedClassNames({
        base: 'btn btn-link font-medium flex items-center gap-1',
        direction: direction === 'before' ? 'mr-auto' : 'ml-auto',
      })}
      aria-label={
        direction === 'before' ? 'Previous document' : 'Next document'
      }
    >
      {direction === 'before' && <CaretLeftIcon noAriaLabel />}
      {label}
      {direction === 'after' && <CaretRightIcon noAriaLabel />}
    </DocumentLink>
  );
};
