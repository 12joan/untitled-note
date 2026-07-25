import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { createBlankDocument } from '~/lib/apis/document';
import { useAppContext } from '~/lib/appContext';
// biome-ignore lint/suspicious/noImportCycles: works
import { awaitRedirect } from '~/lib/awaitRedirect';
import {
  getSessionCookieStorage,
  setSessionCookieStorage,
} from '~/lib/browserStorage';
import { handleCreateDocumentError } from '~/lib/handleErrors';
// biome-ignore lint/suspicious/noImportCycles: works
import { documentPath, overviewPath } from '~/lib/routes';
import type { Tag } from '~/lib/types';

/**
 * We want to allow creation of new documents via a GET request. To prevent
 * abuse through CSRF, we use client-to-client token synchronization. The token
 * must be present both in the URL and in a session cookie to authorize the
 * creation of a new document.
 */
export const newDocumentToken =
  getSessionCookieStorage('new_document_token') ??
  (() => {
    const token = Math.random().toString(36).slice(2);
    setSessionCookieStorage('new_document_token', token);
    return token;
  })();

export interface AwaitNewDocumentProps {
  tagId?: Tag['id'];
}

export const AwaitNewDocument = ({ tagId }: AwaitNewDocumentProps) => {
  const { hash } = useLocation();
  const projectId = useAppContext('projectId');

  const [awaitPath] = useState(() => {
    const hashToken = hash.slice(1);
    const fallbackPath = overviewPath({ projectId });

    if (hashToken !== newDocumentToken) {
      // biome-ignore lint/suspicious/noConsole: logging
      console.error(
        `Invalid token: expected ${JSON.stringify(
          newDocumentToken
        )}, got ${JSON.stringify(hashToken)}`
      );
      return fallbackPath;
    }

    return awaitRedirect({
      projectId,
      promisePath: handleCreateDocumentError(
        createBlankDocument(projectId, { tagId })
      ).then(({ id }) => documentPath({ projectId, documentId: id })),
      fallbackPath,
    });
  });

  return <Navigate to={awaitPath} replace />;
};
