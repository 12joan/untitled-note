import React, { memo, useEffect, useMemo, useReducer, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDocument } from '~/lib/apis/document';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import {
  FutureServiceResult,
  mapFuture,
  pendingFutureServiceResult,
  promiseToFutureServiceResult,
  unwrapFuture,
  unwrapFutureServiceResult,
} from '~/lib/monads';
import { documentWasViewed } from '~/lib/recentlyViewedDocuments';
import { OverviewLink } from '~/lib/routes';
import { Document } from '~/lib/types';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';
import { Editor } from '~/components/Editor';
import { LoadingView } from '~/components/LoadingView';

export interface EditorViewProps {
  documentId: number;
}

export const EditorView = memo(({ documentId }: EditorViewProps) => {
  const projectId = useAppContext('projectId');
  const futurePartialDocuments = useAppContext('futurePartialDocuments');
  const topBarHeight = useAppContext('topBarHeight');

  const [searchParams] = useSearchParams();
  const isFromRecentlyViewed = searchParams.has('recently_viewed');

  const { current: clientId } = useRef(Math.random().toString(36).slice(2));

  const futurePartialDocument = useMemo(
    () =>
      mapFuture(futurePartialDocuments, (partialDocuments) =>
        partialDocuments.find(
          (partialDocument) => partialDocument.id === documentId
        )
      ),
    [futurePartialDocuments, documentId]
  );

  const { updatedBy, updatedAt } = unwrapFuture(futurePartialDocument, {
    pending: {
      updatedBy: undefined,
      updatedAt: undefined,
    },
    resolved: (doc) => ({
      updatedBy: doc?.updated_by,
      updatedAt: doc?.updated_at,
    }),
  });

  useEffect(() => {
    if (!isFromRecentlyViewed) {
      documentWasViewed(documentId);
    }
  }, [isFromRecentlyViewed, documentId]);

  const [fsrInitialDocument, setFsrInitialDocument] = useStateWhileMounted<
    FutureServiceResult<Document, any>
  >(() => pendingFutureServiceResult());

  const [refetchKey, refetch] = useReducer((refetchKey) => refetchKey + 1, 0);

  useEffectAfterFirst(
    () => {
      if (updatedBy && updatedBy !== clientId) {
        refetch();
      }
    },
    [updatedAt],
    updatedAt !== undefined
  );

  useEffect(() => {
    setFsrInitialDocument(pendingFutureServiceResult());

    promiseToFutureServiceResult(
      fetchDocument(projectId, documentId),
      setFsrInitialDocument
    );
  }, [projectId, documentId, refetchKey]);

  return unwrapFutureServiceResult(fsrInitialDocument, {
    pending: (
      // Hack to make React Router scroll restoration work
      <div className="relative" style={{ minHeight: '1000000vh' }}>
        <div
          className="flex sticky min-h-dvh"
          style={{
            top: topBarHeight,
            paddingBottom: topBarHeight,
          }}
        >
          <LoadingView />
        </div>
      </div>
    ),
    success: (initialDocument) => (
      <div className="grow flex flex-col">
        <AppContextProvider documentId={documentId}>
          <Editor clientId={clientId} initialDocument={initialDocument} />
        </AppContextProvider>
      </div>
    ),
    failure: (error) => {
      const doesNotExist = error?.response?.status === 404;

      if (!doesNotExist) {
        // eslint-disable-next-line no-console
        console.error(error);
      }

      const { heading, explanation } = doesNotExist
        ? {
            heading: 'Document not found',
            explanation: 'This document does not exist.',
          }
        : {
            heading: 'Error loading document',
            explanation:
              'An error occurred while loading this document. Make sure you are connected to the internet and try again.',
          };

      return (
        <div className="lg:narrow space-y-3">
          <h1 className="h1">{heading}</h1>
          <p className="text-lg font-light">{explanation}</p>
          <p>
            <OverviewLink className="btn btn-link">Go back</OverviewLink>
          </p>
        </div>
      );
    },
  });
});
