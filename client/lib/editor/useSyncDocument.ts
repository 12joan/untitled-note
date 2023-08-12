import { updateDocument as updateDocumentAPI } from '~/lib/apis/document';
import { useContext } from '~/lib/context';
import { Document, LocalDocument } from '~/lib/types';
import { useEnqueuedPromises } from '~/lib/useEnqueuedPromises';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';

export type UseSyncDocumentOptions = {
  clientId: string;
  initialDocument: Document;
};

export const useSyncDocument = ({
  clientId,
  initialDocument,
}: UseSyncDocumentOptions) => {
  const { projectId } = useContext() as {
    projectId: number;
  };

  const [workingDocument, setWorkingDocument] =
    useStateWhileMounted<LocalDocument>(initialDocument);

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

  const [enqueueUpdatePromise, updateIsDirty] = useEnqueuedPromises();

  const updateDocument = (delta: Partial<LocalDocument>) =>
    setWorkingDocument((previousDocument) => {
      const updatedDocument = {
        ...previousDocument,
        ...delta,
        updated_by: clientId,
      };

      enqueueUpdatePromise(() =>
        updateDocumentAPI(projectId, initialDocument.id, updatedDocument).then(
          extractServerDrivenData
        )
      );

      return updatedDocument;
    });

  return {
    workingDocument,
    updateDocument,
    updateIsDirty,
  };
};
