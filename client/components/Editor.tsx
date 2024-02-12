import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isEditorFocused, PlateEditor } from '@udecode/plate';
import { Range } from 'slate';
import { AppContextProvider } from '~/lib/appContext';
import { useFind } from '~/lib/editor/find';
import { restoreSelection, setSelection } from '~/lib/editor/restoreSelection';
import { useDebouncedSyncDocument } from '~/lib/editor/useDebouncedSyncDocument';
import { useLockedState } from '~/lib/editor/useLockedState';
import { useNavigateAwayOnDelete } from '~/lib/editor/useNavigateAwayOnDelete';
import { useGlobalEvent } from '~/lib/globalEvents';
import { Document } from '~/lib/types';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { EditorBody } from './EditorBody';
import { EditorHeader } from './EditorHeader';
import {useEditorStyle} from '~/lib/editor/useEditorStyle';

export interface EditorProps {
  clientId: string;
  initialDocument: Document;
}

export const Editor = ({ clientId, initialDocument }: EditorProps) => {
  const documentId = initialDocument.id;

  useNavigateAwayOnDelete({ documentId });

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const mentionSuggestionsContainerRef = useRef<HTMLDivElement>(null);

  const [editor, setEditor] = useState<PlateEditor | null>(null);

  const restoreSelectionForEditor = useCallback(
    () => editor && restoreSelection(documentId, editor),
    [editor, documentId]
  );

  useEffect(() => {
    setTimeout(() => {
      if (initialDocument.blank) {
        titleRef.current?.focus();
      } else {
        restoreSelectionForEditor();
      }
    }, 0);
  }, []);

  const {
    setTitle,
    onBodyChange,
    isDirty,
    workingDocument,
    updateDocument,
    isFailing,
    lastSuccessfulUpdate,
  } = useDebouncedSyncDocument({
    editor,
    clientId,
    initialDocument,
  });

  useTitle(workingDocument.safe_title);

  const { isLocked, isReadOnly, temporarilyUnlock, resumeLock } =
    useLockedState(workingDocument);

  const editorStyle = useEditorStyle(workingDocument);

  const { findDialog, openFind } = useFind({
    editor: editor ?? undefined,
    restoreSelection: restoreSelectionForEditor,
    setSelection: (selection: Range) =>
      editor && setSelection(editor, selection),
  });

  // Restore focus when closing modals
  const wasFocusedBeforeModalRef = useRef<boolean>(false);

  useGlobalEvent(
    'modal:open',
    () => {
      wasFocusedBeforeModalRef.current = !!editor && isEditorFocused(editor);
    },
    [editor]
  );

  useGlobalEvent(
    'modal:close',
    () => {
      if (wasFocusedBeforeModalRef.current) {
        restoreSelectionForEditor();
      }
    },
    [restoreSelectionForEditor]
  );

  return (
    <div className="contents em:space-y-3">
      {findDialog}

      {editorStyle}

      <div className="lg:narrow">
        <BackButton />
      </div>

      <EditorHeader
        editor={editor}
        titleRef={titleRef}
        workingDocument={workingDocument}
        updateDocument={updateDocument}
        setTitle={setTitle}
        isReadOnly={isReadOnly}
        isLocked={isLocked}
        temporarilyUnlock={temporarilyUnlock}
        resumeLock={resumeLock}
        isDirty={isDirty}
        isFailing={isFailing}
        lastSuccessfulUpdate={lastSuccessfulUpdate}
        openFind={openFind}
      />

      <AppContextProvider
        mentionSuggestionsContainerRef={mentionSuggestionsContainerRef}
        linkOriginator={workingDocument.safe_title}
      >
        <EditorBody
          editor={editor}
          setEditor={setEditor}
          initialDocument={initialDocument}
          isReadOnly={isReadOnly}
          onBodyChange={onBodyChange}
          onDoubleClick={temporarilyUnlock}
        />
      </AppContextProvider>

      <div
        ref={mentionSuggestionsContainerRef}
        // Override block spacing
        style={{ margin: 0 }}
      />
    </div>
  );
};
