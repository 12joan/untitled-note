import React, {
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createPlateEditor,
  deserializeHtml,
  ELEMENT_PARAGRAPH,
  Plate,
  PlateEditor,
  PlatePlugin,
  usePlateEditorState,
} from '@udecode/plate';
import { Range } from 'slate';
import { updateDocument as updateDocumentAPI } from '~/lib/apis/document';
import { ContextProvider, useContext } from '~/lib/context';
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
import { useGlobalEvent } from '~/lib/globalEvents';
import { overviewPath } from '~/lib/routes';
import { Document, LocalDocument } from '~/lib/types';
import { useDebounce } from '~/lib/useDebounce';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';
import { useEnqueuedPromises } from '~/lib/useEnqueuedPromises';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { DocumentMenu } from '~/components/DocumentMenu';
import { Dropdown } from '~/components/Dropdown';
import { EditorTags } from '~/components/EditorTags';
import { EditorTitle } from '~/components/EditorTitle';
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon';
import TagsIcon from '~/components/icons/TagsIcon';
import { FormattingToolbar } from '~/components/layout/FormattingToolbar';
import { Tooltip } from '~/components/Tooltip';

type UseSyncDocumentOptions = {
  clientId: string;
  initialDocument: Document;
};

const useSyncDocument = ({
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

const useWarnIfUnsavedChanges = (isDirty: boolean) => {
  useEffect(() => {
    if (isDirty) {
      const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = '';
      };

      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () =>
        window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
  }, [isDirty]);
};

type UseInitialValueOptions = {
  initialDocument: Document;
  plugins: PlatePlugin[];
};

const useInitialValue = ({
  initialDocument,
  plugins,
}: UseInitialValueOptions) =>
  useMemo(() => {
    const bodyFormat = initialDocument.body_type.split('/')[0];
    const emptyDocument = [
      { type: ELEMENT_PARAGRAPH, children: [{ text: '' }] },
    ];

    if (bodyFormat === 'empty') {
      return emptyDocument;
    }

    if (bodyFormat === 'html') {
      const tempEditor = createPlateEditor({ plugins });

      const initialValue = deserializeHtml(tempEditor, {
        element: initialDocument.body,
        stripWhitespace: true,
      });

      return initialValue[0]?.type ? initialValue : emptyDocument;
    }

    if (bodyFormat === 'json') {
      return JSON.parse(initialDocument.body);
    }

    throw new Error(`Unknown body format: ${bodyFormat}`);
  }, []);

type UseNavigateAwayOnDeleteOptions = {
  documentId: Document['id'];
};

const useNavigateAwayOnDelete = ({
  documentId,
}: UseNavigateAwayOnDeleteOptions) => {
  const { projectId } = useContext() as {
    projectId: number;
  };

  const navigate = useNavigate();

  useGlobalEvent('document:delete', ({ documentId: deletedDocumentId }) => {
    if (deletedDocumentId === documentId) {
      navigate(overviewPath({ projectId }));
    }
  });
};

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

  const { workingDocument, updateDocument, updateIsDirty } = useSyncDocument({
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

  useWarnIfUnsavedChanges(updateIsDirty || titleIsDirty || bodyIsDirty);

  const { findDialog, openFind } = useFind({
    editor: editorRef.current || undefined,
    restoreSelection: restoreSelectionForEditor,
    setSelection: (selection: Range) =>
      setSelection(editorRef.current!, selection),
  });

  const withLinkModalProvider = useLinkModalProvider({
    onClose: restoreSelectionForEditor,
  });

  const plugins = usePlugins();

  const initialValue = useInitialValue({
    initialDocument,
    plugins,
  });

  const plateComponent = useMemo(
    () => (
      <Plate
        editorRef={editorRef}
        id="editor"
        plugins={plugins}
        initialValue={initialValue}
        normalizeInitialValue
        editableProps={{
          className:
            'grow prose prose-slate dark:prose-invert max-w-none text-black dark:text-white text-lg no-focus-ring children:lg:narrow',
          placeholder: 'Write something...',
        }}
      >
        <WithEditorState
          initialDocument={initialDocument}
          debouncedUpdateBody={debouncedUpdateBody}
        />
      </Plate>
    ),
    [plugins]
  );

  const documentMenu = (
    <DocumentMenu
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
    <>
      {findDialog}

      <div className="lg:narrow mb-3">
        <BackButton />
      </div>

      <div className="cursor-text" onClick={() => titleRef.current?.focus()}>
        <div className="lg:narrow flex gap-2">
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
        <ContextProvider
          mentionSuggestionsContainerRef={mentionSuggestionsContainerRef}
          linkOriginator={workingDocument.safe_title}
          children={plateComponent}
        />
      )}

      <div ref={mentionSuggestionsContainerRef} />
    </>
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
  const { useFormattingToolbar } = useContext() as {
    useFormattingToolbar: (children: ReactNode) => JSX.Element;
  };

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
