import { useCallback } from 'react';
import { PlateEditor } from '@udecode/plate';
import {
  useSyncDocument,
  UseSyncDocumentOptions,
} from '~/lib/editor/useSyncDocument';
import { useGlobalEvent } from '~/lib/globalEvents';
import { useBeforeUnload } from '~/lib/useBeforeUnload';
import { useDebounce } from '~/lib/useDebounce';
import { documentDataForUpload } from './documentDataForUpload';

export interface UseDebouncedSyncDocumentOptions
  extends UseSyncDocumentOptions {
  editor: PlateEditor | null;
}

export const useDebouncedSyncDocument = ({
  editor,
  ...options
}: UseDebouncedSyncDocumentOptions) => {
  const syncDocumentState = useSyncDocument(options);

  const { updateDocument, isDirty: updateIsDirty } = syncDocumentState;

  const [debouncedUpdateTitle, titleIsDirty] = useDebounce(
    (title: string) => updateDocument({ title }),
    750,
    [updateDocument]
  );

  const setTitle = useCallback(
    (title: string) => {
      const normalizedTitle = title.replace(/[\n\r]+/g, '');
      debouncedUpdateTitle(normalizedTitle);
    },
    [debouncedUpdateTitle]
  );

  const [debouncedUpdateBody, bodyIsDirty] = useDebounce(
    () => editor && updateDocument(documentDataForUpload(editor)),
    750,
    [editor, updateDocument]
  );

  /**
   * When an upload becomes complete, this affects what data is sent to the
   * server even though the editor value hasn't changed.
   */
  useGlobalEvent('s3File:uploadComplete', debouncedUpdateBody, [
    debouncedUpdateBody,
  ]);

  const isDirty = updateIsDirty || titleIsDirty || bodyIsDirty;
  useBeforeUnload(isDirty);

  return {
    ...syncDocumentState,
    setTitle,
    onBodyChange: debouncedUpdateBody,
    isDirty,
  };
};
