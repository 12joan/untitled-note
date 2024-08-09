import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Range } from 'slate';
import { AppContextProvider } from '~/lib/appContext';
import { useFind } from '~/lib/editor/find';
import { isEditorFocused, PlateEditor } from '~/lib/editor/plate';
import { usePlugins } from '~/lib/editor/plugins';
import {
  restoreSelection,
  saveSelection,
  setSelection,
} from '~/lib/editor/restoreSelection';
import { useDebouncedSyncDocument } from '~/lib/editor/useDebouncedSyncDocument';
import { useEditorStyle } from '~/lib/editor/useEditorStyle';
import { useInitialValue } from '~/lib/editor/useInitialValue';
import { useLockedState } from '~/lib/editor/useLockedState';
import { useNavigateAwayOnDelete } from '~/lib/editor/useNavigateAwayOnDelete';
import { useGlobalEvent } from '~/lib/globalEvents';
import { Document } from '~/lib/types';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { EditorBody } from '~/components/EditorBody';
import { EditorHeader } from '~/components/EditorHeader';
import { SequenceBeforeAndAfter } from '~/components/SequenceBeforeAndAfter';

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

  const saveSelectionForEditor = useCallback(
    () => editor && saveSelection(documentId, editor),
    [documentId, editor]
  );

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

  useEffect(() => {
    if (editor) {
      editor.style = editorStyle;
    }
  }, [editor, editorStyle]);

  const plugins = usePlugins();

  const initialValue = useInitialValue({
    initialDocument,
    plugins,
  });

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
        /**
         * Without setTimeout, the selection sometimes jumps to the top of the
         * document. Not clear why.
         */
        setTimeout(restoreSelectionForEditor);
      }
    },
    [restoreSelectionForEditor]
  );

  return (
    <div className="contents em:space-y-3">
      {findDialog}

      <div className="lg:narrow">
        <BackButton />
      </div>

      {workingDocument.sequence_tag_id && (
        <SequenceBeforeAndAfter workingDocument={workingDocument as any} />
      )}

      <AppContextProvider
        mentionSuggestionsContainerRef={mentionSuggestionsContainerRef}
        linkOriginator={workingDocument.safe_title}
        editorStyle={editorStyle}
      >
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

        <EditorBody
          setEditor={setEditor}
          initialValue={initialValue}
          plugins={plugins}
          isReadOnly={isReadOnly}
          className="grow max-w-none children:lg:narrow"
          onBodyChange={onBodyChange}
          onSelectionChange={saveSelectionForEditor}
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
