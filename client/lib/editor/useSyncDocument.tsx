import React from 'react';
import { updateDocument as updateDocumentAPI } from '~/lib/apis/document';
import { useAppContext } from '~/lib/appContext';
import { pluralize } from '~/lib/pluralize';
import { useToast } from '~/lib/toasts';
import { Document, LocalDocument } from '~/lib/types';
import { useEnqueuedPromises } from '~/lib/useEnqueuedPromises';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';
import { TimeAgo } from '~/components/TimeAgo';

export type UseSyncDocumentOptions = {
  clientId: string;
  initialDocument: Document;
};

export const useSyncDocument = ({
  clientId,
  initialDocument,
}: UseSyncDocumentOptions) => {
  const projectId = useAppContext('projectId');

  const [lastSuccessfulUpdate, setLastSuccessfulUpdate] =
    useStateWhileMounted<Date>(() => new Date(initialDocument.updated_at));

  const [workingDocument, setWorkingDocument] =
    useStateWhileMounted<LocalDocument>(initialDocument);

  const [changesSinceLastUpdate, setChangesSinceLastUpdate] =
    useStateWhileMounted(0);

  const extractServerDrivenData = (remoteDocument: Document) =>
    setWorkingDocument((localDocument) => ({
      ...localDocument,
      safe_title: remoteDocument.safe_title,
      tags: localDocument.tags.map((localTag) => {
        if (localTag.id) {
          return localTag;
        }

        const remoteTag = remoteDocument.tags.find(
          (remoteTag) => remoteTag.text === localTag.text
        );

        return remoteTag || localTag;
      }),
    }));

  const { enqueuePromise, isDirty, isFailing } = useEnqueuedPromises();

  const updateDocument = (delta: Partial<LocalDocument>) => {
    setChangesSinceLastUpdate((count) => count + 1);

    setWorkingDocument((previousDocument) => {
      const updatedDocument = {
        ...previousDocument,
        ...delta,
        updated_by: clientId,
      };

      enqueuePromise(async () => {
        const updateResult = await updateDocumentAPI(
          projectId,
          initialDocument.id,
          updatedDocument
        );
        extractServerDrivenData(updateResult);
        setLastSuccessfulUpdate(new Date());
        setChangesSinceLastUpdate(0);
      });

      return updatedDocument;
    });
  };

  useToast(
    isFailing
      ? {
          title: 'Unable to save changes',
          message: () => (
            <>
              <p>
                Last saved <TimeAgo date={lastSuccessfulUpdate} />
              </p>
              <p>
                {pluralize(changesSinceLastUpdate, 'change')} since last save
              </p>
            </>
          ),
          autoClose: 'none',
          ariaLive: 'assertive',
        }
      : null,
    {
      toastDeps: [isFailing, lastSuccessfulUpdate, changesSinceLastUpdate],
      reopenDeps: [isFailing, changesSinceLastUpdate],
    }
  );

  return {
    workingDocument,
    updateDocument,
    isDirty,
    isFailing,
    lastSuccessfulUpdate,
    changesSinceLastUpdate,
  };
};
