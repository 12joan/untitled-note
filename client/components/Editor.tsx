import React, {
  ChangeEvent,
  KeyboardEvent,
  MutableRefObject,
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
  usePlateEditorState,
} from '@udecode/plate-headless';
import { Range } from 'slate';
import { updateDocument as updateDocumentAPI } from '~/lib/apis/document';
import { ContextProvider, useContext } from '~/lib/context';
import { editorDataForUpload } from '~/lib/editor/editorDataForUpload';
import { useFind } from '~/lib/editor/find';
import { useLinkModalProvider } from '~/lib/editor/links';
import usePlugins from '~/lib/editor/plugins';
import {
  restoreScroll,
  restoreSelection,
  setSelection,
  useSaveScroll,
  useSaveSelection,
} from '~/lib/editor/selectionAndScrollManagement';
import { useGlobalEvent } from '~/lib/globalEvents';
import { overviewPath } from '~/lib/routes';
import { Document } from '~/lib/types';
import { useDebounce } from '~/lib/useDebounce';
import { useEffectAfterFirst } from '~/lib/useEffectAfterFirst';
import useEnqueuedPromises from '~/lib/useEnqueuedPromises';
import { useStateWhileMounted } from '~/lib/useStateWhileMounted';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { DocumentMenu } from '~/components/DocumentMenu';
import { Dropdown } from '~/components/Dropdown';
import EditorTags from '~/components/EditorTags';
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon';
import TagsIcon from '~/components/icons/TagsIcon';
import FormattingToolbar from '~/components/layout/FormattingToolbar';
import TextareaAutosize from '~/components/TextareaAutosize';
import { Tooltip } from '~/components/Tooltip';

export interface EditorProps {
  clientId: string;
  initialDocument: Document;
}

export const Editor = ({ clientId, initialDocument }: EditorProps) => {
  const { projectId } = useContext() as {
    projectId: number;
  };

  const [workingDocument, setWorkingDocument] =
    useStateWhileMounted(initialDocument);

  useTitle(workingDocument.safe_title);

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

  const updateDocument = (delta: Partial<Document>) =>
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

  const titleRef = useRef<HTMLDivElement>();
  const tagsRef = useRef<HTMLDivElement>();
  const mentionSuggestionsContainerRef = useRef<HTMLDivElement>(null);
  const editorElementRef = useRef<HTMLDivElement>();
  const editorRef = useRef<PlateEditor | null>(null);

  useEffect(() => {
    editorElementRef.current = document.querySelector(
      '[data-slate-editor]'
    ) as HTMLDivElement;
  }, []);

  const [tagsVisible, setTagsVisible] = useState(
    initialDocument.tags.length > 0
  );

  const navigate = useNavigate();

  useGlobalEvent('document:delete', ({ documentId }) => {
    if (documentId === initialDocument.id) {
      navigate(overviewPath({ projectId }));
    }
  });

  const restoreSelectionForEditor = () =>
    restoreSelection(initialDocument.id, editorRef.current);

  const { findDialog, openFind } = useFind({
    editorRef,
    restoreSelection: restoreSelectionForEditor,
    setSelection: (selection: Range) =>
      setSelection(editorRef.current, selection),
  });

  const plugins = usePlugins();

  const initialValue = useMemo(() => {
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

  const documentMenu = (
    <DocumentMenu
      document={workingDocument}
      updateDocument={updateDocument}
      invalidateEditor={false}
      openFind={openFind}
      showReplace
    />
  );

  const withLinkModalProvider = useLinkModalProvider({
    onClose: restoreSelectionForEditor,
  });

  const plateComponent = useMemo(
    () => (
      <Plate
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
          titleRef={titleRef}
          editorRef={editorRef}
          restoreSelectionForEditor={restoreSelectionForEditor}
        />
      </Plate>
    ),
    [plugins]
  );

  return (
    <>
      {findDialog}

      <div className="lg:narrow mb-3">
        <BackButton />
      </div>

      <div className="cursor-text" onClick={() => titleRef.current?.focus()}>
        <div className="lg:narrow flex gap-2">
          <TextareaAutosize
            ref={titleRef}
            className="min-w-0 grow h1 text-black dark:text-white placeholder:truncate"
            defaultValue={initialDocument.title || ''}
            placeholder="Untitled document"
            ignorePlaceholder
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setTitle(event.target.value)
            }
            onKeyDown={(event: KeyboardEvent) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                editorElementRef.current?.focus();
              }
            }}
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
  titleRef: MutableRefObject<HTMLDivElement | undefined>;
  editorRef: MutableRefObject<PlateEditor | null>;
  restoreSelectionForEditor: () => void;
}

const WithEditorState = ({
  initialDocument,
  debouncedUpdateBody,
  titleRef,
  editorRef,
  restoreSelectionForEditor,
}: WithEditorStateProps) => {
  const editor = usePlateEditorState('editor');
  const { useFormattingToolbar } = useContext() as {
    useFormattingToolbar: (children: ReactNode) => JSX.Element;
  };

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    setTimeout(() => {
      if (initialDocument.blank) {
        titleRef.current?.focus();
      } else {
        restoreSelectionForEditor();
      }

      restoreScroll(initialDocument.id);
    }, 0);
  }, []);

  useSaveSelection(initialDocument.id, editor);
  useSaveScroll(initialDocument.id);

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
