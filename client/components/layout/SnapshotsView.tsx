import React, { memo } from 'react';
import { streamDocument } from '~/lib/apis/document';
import { streamSnapshots } from '~/lib/apis/snapshot';
import { Future, sequenceFutures, unwrapFuture } from '~/lib/monads';
import { DocumentLink, OverviewLink } from '~/lib/routes';
import { Document, Snapshot } from '~/lib/types';
import { useStream } from '~/lib/useStream';
import CaretLeftIcon from '~/components/icons/CaretLeftIcon';
import { LoadingView } from '~/components/LoadingView';
import { InlinePlaceholder } from '~/components/Placeholder';
import {
  SnapshotExplorer,
  SnapshotExplorerProps,
} from '~/components/SnapshotExplorer';

export interface SnapshotsViewProps {
  documentId: number;
}

export const SnapshotsView = memo(({ documentId }: SnapshotsViewProps) => {
  const futureDocument = useStream<Document | null>(
    {
      getStream: (resolve) => streamDocument(documentId, resolve),
      cacheKey: `document-${documentId}`,
    },
    [documentId]
  );

  const futureSnapshots = useStream<Snapshot[]>(
    {
      getStream: (resolve) => streamSnapshots(documentId, resolve),
      cacheKey: `snapshots-${documentId}`,
    },
    [documentId]
  );

  const isNotFound = unwrapFuture(futureDocument, {
    pending: false,
    resolved: (doc) => doc === null,
  });

  if (isNotFound) {
    return (
      <div className="space-y-3">
        <h1 className="h1">Document not found</h1>
        <p className="text-lg font-light">This document does not exist.</p>
        <p>
          <OverviewLink className="btn btn-link">Go back</OverviewLink>
        </p>
      </div>
    );
  }

  const isNonJson = unwrapFuture(futureDocument, {
    pending: false,
    resolved: (doc) => doc?.body_type !== 'json/slate',
  });

  if (isNonJson) {
    return (
      <div className="space-y-3">
        <h1 className="h1">Snapshots not available</h1>
        <p className="text-lg font-light">
          Snapshots are not available for this document.
        </p>
        <p>
          <DocumentLink to={{ documentId }} className="btn btn-link">
            Go back
          </DocumentLink>
        </p>
      </div>
    );
  }

  const futureSnapshotExplorerProps: Future<SnapshotExplorerProps> =
    sequenceFutures({
      document: futureDocument as Future<Document>,
      snapshots: futureSnapshots,
    });

  return (
    <div className="grow flex flex-col">
      <DocumentLink
        to={{ documentId }}
        className="btn btn-link flex items-center gap-1 font-medium mb-3"
      >
        <CaretLeftIcon noAriaLabel />
        {unwrapFuture(futureDocument, {
          pending: 'Document',
          resolved: (doc) => doc!.safe_title,
        })}
      </DocumentLink>

      <h1 className="mb-5 h1">
        Snapshots for{' '}
        {unwrapFuture(futureDocument, {
          pending: <InlinePlaceholder />,
          resolved: (doc) => <>{doc!.safe_title}</>,
        })}
      </h1>

      {unwrapFuture(futureSnapshotExplorerProps, {
        pending: <LoadingView />,
        resolved: (props) => <SnapshotExplorer {...props} />,
      })}
    </div>
  );
});
