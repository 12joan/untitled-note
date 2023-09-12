import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  isEditorFocused,
  Plate,
  PlateEditor,
  usePlateEditorState,
} from '@udecode/plate';
import { Range } from 'slate';
import { AppContextProvider, useAppContext } from '~/lib/appContext';
import {
  editorDataForUpload,
  getFilteredEditor,
} from '~/lib/editor/editorDataForUpload';
import { useFind } from '~/lib/editor/find';
import { useLinkModalProvider } from '~/lib/editor/links';
import { usePlugins } from '~/lib/editor/plugins';
import {
  restoreSelection,
  setSelection,
  useSaveSelection,
} from '~/lib/editor/restoreSelection';
import { useInitialValue } from '~/lib/editor/useInitialValue';
import { useNavigateAwayOnDelete } from '~/lib/editor/useNavigateAwayOnDelete';
import { useSyncDocument } from '~/lib/editor/useSyncDocument';
import { useEditorFontSizeCSSValue } from '~/lib/editorFontSize';
import { useGlobalEvent } from '~/lib/globalEvents';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { Document } from '~/lib/types';
import { useBeforeUnload } from '~/lib/useBeforeUnload';
import { useDebounce } from '~/lib/useDebounce';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { DocumentMenu } from '~/components/DocumentMenu';
import { DocumentStatusHeader } from '~/components/DocumentStatusHeader';
import { Dropdown } from '~/components/Dropdown';
import { EditorTags } from '~/components/EditorTags';
import { EditorTitle } from '~/components/EditorTitle';
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon';
import TagsIcon from '~/components/icons/TagsIcon';
import { FormattingToolbar } from '~/components/layout/FormattingToolbar';
import { Tooltip } from '~/components/Tooltip';

export interface EditorProps {
  clientId: string;
  initialDocument: Document;
}

export const Editor = ({ clientId, initialDocument }: EditorProps) => {
  useNavigateAwayOnDelete({ documentId: initialDocument.id });

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLDivElement>();
  const mentionSuggestionsContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<PlateEditor>(null);

  const fontSize = useEditorFontSizeCSSValue();

  const [tagsVisible, setTagsVisible] = useState(
    initialDocument.tags.length > 0
  );

  const restoreSelectionForEditor = () =>
    restoreSelection(initialDocument.id, editorRef.current!);

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
    workingDocument,
    updateDocument,
    isDirty: updateIsDirty,
    isFailing: updateIsFailing,
    lastSuccessfulUpdate,
  } = useSyncDocument({
    clientId,
    initialDocument,
  });

  useTitle(workingDocument.safe_title);

  const [debouncedUpdateTitle, titleIsDirty] = useDebounce(
    (title: string) => updateDocument({ title }),
    750
  );

  const setTitle = (title: string) => {
    const normalizedTitle = title.replace(/[\n\r]+/g, '');
    debouncedUpdateTitle(normalizedTitle);
  };

  const [debouncedUpdateBody, bodyIsDirty] = useDebounce(
    (editor: PlateEditor) => {
      updateDocument(editorDataForUpload(editor));
    },
    750
  );

  const isDirty = updateIsDirty || titleIsDirty || bodyIsDirty;
  useBeforeUnload(isDirty);

  const { findDialog, openFind } = useFind({
    editor: editorRef.current || undefined,
    restoreSelection: restoreSelectionForEditor,
    setSelection: (selection: Range) =>
      setSelection(editorRef.current!, selection),
  });

  const withLinkModalProvider = useLinkModalProvider();

  const wasFocusedBeforeModalRef = useRef<boolean>(false);

  useGlobalEvent(
    'modal:open',
    () => {
      wasFocusedBeforeModalRef.current = isEditorFocused(editorRef.current!);
    },
    [editorRef]
  );

  useGlobalEvent(
    'modal:close',
    () => {
      if (wasFocusedBeforeModalRef.current) {
        restoreSelectionForEditor();
      }
    },
    [editorRef]
  );

  const plugins = usePlugins();

  const initialValue = useInitialValue({
    initialDocument,
    plugins,
  });

  const plateComponent = useMemo(
    () => (
      <Plate
        editorRef={editorRef}
        plugins={plugins}
        initialValue={initialValue}
        normalizeInitialValue
        editableProps={{
          className: groupedClassNames({
            sizing: 'grow max-w-none children:lg:narrow',
            spacing: 'em:mt-3 em:space-y-3',
            textColor: 'text-black dark:text-white',
            focusRing: 'no-focus-ring',
            baseFontSize:
              'slate-void:em:text-lg slate-string:em:text-lg/[1.555em]',
          }),
          placeholder: 'Write something...',
          style: { fontSize },
        }}
      >
        <WithEditorState
          initialDocument={initialDocument}
          debouncedUpdateBody={debouncedUpdateBody}
        />
      </Plate>
    ),
    [plugins, fontSize]
  );

  const documentMenu = (
    <DocumentMenu
      statusHeader={
        <DocumentStatusHeader
          isDirty={isDirty}
          isFailing={updateIsFailing}
          lastSuccessfulUpdate={lastSuccessfulUpdate}
        />
      }
      document={workingDocument}
      updateDocument={updateDocument}
      invalidateEditor={false}
      openFind={openFind}
      showReplace
      getEditorChildrenForExport={() =>
        getFilteredEditor(editorRef.current!).children
      }
    />
  );

  return (
    <div className="contents em:space-y-3">
      {findDialog}

      <div className="lg:narrow">
        <BackButton />
      </div>

      <div className="cursor-text" onClick={() => titleRef.current?.focus()}>
        <div className="lg:narrow flex gap-2 items-center">
          <EditorTitle
            ref={titleRef}
            initialTitle={initialDocument.title || ''}
            onChange={setTitle}
            onEnter={() =>
              setSelection(editorRef.current!, {
                anchor: { path: [0, 0], offset: 0 },
                focus: { path: [0, 0], offset: 0 },
              })
            }
          />

          {!tagsVisible && (
            <div onClick={(event) => event.stopPropagation()}>
              <Tooltip content="Add tags" placement="bottom">
                <button
                  type="button"
                  className="btn p-2 aspect-square"
                  onClick={() => {
                    setTagsVisible(true);
                    tagsRef.current?.focus();
                  }}
                >
                  <TagsIcon size="1.25em" ariaLabel="Add tags" />
                </button>
              </Tooltip>
            </div>
          )}

          <div onClick={(event) => event.stopPropagation()}>
            <Dropdown items={documentMenu} placement="bottom-end">
              <button type="button" className="btn p-2 aspect-square">
                <OverflowMenuIcon size="1.25em" ariaLabel="Document menu" />
              </button>
            </Dropdown>
          </div>
        </div>
      </div>

      <EditorTags
        ref={tagsRef}
        workingDocument={workingDocument}
        updateDocument={updateDocument}
        visible={tagsVisible}
        setVisible={setTagsVisible}
      />

      {withLinkModalProvider(
        <AppContextProvider
          mentionSuggestionsContainerRef={mentionSuggestionsContainerRef}
          linkOriginator={workingDocument.safe_title}
          children={plateComponent}
        />
      )}

      <div ref={mentionSuggestionsContainerRef} />
    </div>
  );
};

interface WithEditorStateProps {
  initialDocument: Document;
  debouncedUpdateBody: (editor: PlateEditor) => void;
}

const WithEditorState = ({
  initialDocument,
  debouncedUpdateBody,
}: WithEditorStateProps) => {
  const editor = usePlateEditorState();
  const useFormattingToolbar = useAppContext('useFormattingToolbar');

  useSaveSelection(initialDocument.id, editor);

  const [forceUpdateBodyKey, forceUpdateBody] = useReducer((x) => x + 1, 0);

  useGlobalEvent('s3File:uploadComplete', () => forceUpdateBody());

  useEffectAfterFirst(() => {
    debouncedUpdateBody(editor);
  }, [editor.children, forceUpdateBodyKey]);

  const formattingToolbar = useFormattingToolbar(
    <FormattingToolbar editor={editor} />
  );

  return formattingToolbar;
};
