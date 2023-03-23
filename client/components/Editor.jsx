import React, { useRef, useEffect, useMemo, useState, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plate,
  createPlateEditor,
  usePlateEditorState,
  deserializeHtml,
  ELEMENT_PARAGRAPH,
} from '@udecode/plate-headless'

import { useContext, ContextProvider } from '~/lib/context'
import useTitle from '~/lib/useTitle'
import useStateWhileMounted from '~/lib/useStateWhileMounted'
import useEnqueuedPromises from '~/lib/useEnqueuedPromises'
import DocumentsAPI from '~/lib/resources/DocumentsAPI'
import useDebounce from '~/lib/useDebounce'
import { useGlobalEvent } from '~/lib/globalEvents'
import { overviewPath } from '~/lib/routes'
import useEffectAfterFirst from '~/lib/useEffectAfterFirst'
import usePlugins from '~/lib/editor/plugins'
import { useLinkModalProvider } from '~/lib/editor/links'
import editorDataForUpload from '~/lib/editor/editorDataForUpload'
import { useEditorEvent } from '~/lib/editor/imperativeEvents'
import { useFind } from '~/lib/editor/find'
import {
  useSaveSelection,
  useSaveScroll,
  restoreSelection,
  restoreScroll,
  setSelection,
} from '~/lib/editor/selectionAndScrollManagement'

import BackButton from '~/components/BackButton'
import Tooltip from '~/components/Tooltip'
import TextareaAutosize from '~/components/TextareaAutosize'
import Dropdown from '~/components/Dropdown'
import DocumentMenu from '~/components/DocumentMenu'
import EditorTags from '~/components/EditorTags'
import FormattingToolbar from '~/components/layout/FormattingToolbar'
import TagsIcon from '~/components/icons/TagsIcon'
import OverflowMenuIcon from '~/components/icons/OverflowMenuIcon'

const Editor = ({ clientId, initialDocument }) => {
  const { projectId, topBarHeight } = useContext()

  const [workingDocument, setWorkingDocument] = useStateWhileMounted(initialDocument)

  useTitle(workingDocument.safe_title)

  const extractServerDrivenData = remoteDocument => setWorkingDocument(localDocument => ({
    ...localDocument,
    safe_title: remoteDocument.safe_title,
    tags: localDocument.tags.map(localTag => {
      if (localTag.id) {
        return localTag
      }

      const remoteTag = remoteDocument.tags.find(remoteTag => remoteTag.text === localTag.text)

      return remoteTag || localTag
    }),
  }))

  const [enqueueUpdatePromise, updateIsDirty] = useEnqueuedPromises()

  const updateDocument = delta => setWorkingDocument(previousDocument => {
    const updatedDocument = { ...previousDocument, ...delta, updated_by: clientId }

    enqueueUpdatePromise(() => DocumentsAPI(projectId)
      .update(updatedDocument)
      .then(extractServerDrivenData)
    )

    return updatedDocument
  })

  const [workingTitle, setWorkingTitle] = useState(initialDocument.title)
  const [debouncedUpdateTitle, titleIsDirty] = useDebounce(title => updateDocument({ title }), 750)

  const setTitle = title => {
    const normalizedTitle = title.replace(/[\n\r]+/g, '')
    setWorkingTitle(normalizedTitle)
    debouncedUpdateTitle(normalizedTitle)
  }

  const [debouncedUpdateBody, bodyIsDirty] = useDebounce(editor => {
    updateDocument(editorDataForUpload(editor))
  }, 750)

  const isDirty = updateIsDirty || titleIsDirty || bodyIsDirty

  useEffect(() => {
    if (isDirty) {
      const beforeUnloadHandler = event => {
        event.preventDefault()
        event.returnValue = ''
      }

      window.addEventListener('beforeunload', beforeUnloadHandler)
      return () => window.removeEventListener('beforeunload', beforeUnloadHandler)
    }
  }, [isDirty])

  const titleRef = useRef()
  const tagsRef = useRef()
  const mentionSuggestionsContainerRef = useRef()
  const editorElementRef = useRef()
  const editorRef = useRef()

  useEffect(() => {
    editorElementRef.current = document.querySelector('[data-slate-editor]')
  }, [])

  const [tagsVisible, setTagsVisible] = useState(initialDocument.tags.length > 0)

  const navigate = useNavigate()

  useGlobalEvent('document:delete', ({ documentId }) => {
    if (documentId === initialDocument.id) {
      navigate(overviewPath(projectId))
    }
  })

  const restoreSelectionForEditor = () => restoreSelection(initialDocument.id, editorRef.current)

  const { findDialog, openFind } = useFind({
    editorRef,
    restoreSelection: restoreSelectionForEditor,
    setSelection: selection => setSelection(editorRef.current, selection),
  })

  const plugins = usePlugins()

  const initialValue = useMemo(() => {
    const bodyFormat = initialDocument.body_type.split('/')[0]
    const emptyDocument = [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]

    switch (bodyFormat) {
      case 'empty':
        return emptyDocument

      case 'html':
        const tempEditor = createPlateEditor({ plugins })

        const initialValue = deserializeHtml(tempEditor, {
          element: initialDocument.body,
          stripWhitespace: true,
        })

        return initialValue[0]?.type ? initialValue : emptyDocument

      case 'json':
        return JSON.parse(initialDocument.body)

      default:
        throw new Error(`Unknown body format: ${bodyFormat}`)
    }
  }, [])

  const documentMenu = (
    <DocumentMenu
      document={workingDocument}
      updateDocument={updateDocument}
      invalidateEditor={false}
      openFind={openFind}
      showReplace
    />
  )

  const withLinkModalProvider = useLinkModalProvider({
    onClose: restoreSelectionForEditor,
  })

  const plateComponent = useMemo(() => (
    <Plate
      id="editor"
      plugins={plugins}
      initialValue={initialValue}
      normalizeInitialValue
      editableProps={{
        className: 'grow prose prose-slate dark:prose-invert max-w-none text-black dark:text-white text-lg no-focus-ring children:narrow',
        placeholder: 'Write something...',
      }}
    >
      <WithEditorState
        initialDocument={initialDocument}
        debouncedUpdateBody={debouncedUpdateBody}
        titleRef={titleRef}
        editorElementRef={editorElementRef}
        editorRef={editorRef}
        restoreSelectionForEditor={restoreSelectionForEditor}
      />
    </Plate>
  ), [plugins])

  return (
    <>
      {findDialog}

      <div className="narrow mb-3">
        <BackButton />
      </div>

      <div className="cursor-text" onClick={() => titleRef.current.focus()}>
        <div className="narrow flex gap-2">
          <TextareaAutosize
            ref={titleRef}
            className="min-w-0 grow h1 text-black dark:text-white placeholder:truncate"
            defaultValue={initialDocument.title || ''}
            placeholder="Untitled document"
            ignorePlaceholder
            onChange={event => setTitle(event.target.value)}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault()
                editorElementRef.current.focus()
              }
            }}
          />

          {!tagsVisible && (
            <div onClick={event => event.stopPropagation()}>
              <Tooltip content="Add tags" placement="bottom">
                <button
                  type="button"
                  className="btn p-2 aspect-square"
                  onClick={() => {
                    setTagsVisible(true)
                    tagsRef.current.focus()
                  }}
                >
                  <TagsIcon size="1.25em" ariaLabel="Add tags" />
                </button>
              </Tooltip>
            </div>
          )}

          <div onClick={event => event.stopPropagation()}>
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
  )
}

const WithEditorState = ({
  initialDocument,
  debouncedUpdateBody,
  titleRef,
  editorElementRef,
  editorRef,
  restoreSelectionForEditor,
}) => {
  const editor = usePlateEditorState('editor')
  const { useFormattingToolbar } = useContext()

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  useEffect(() => {
    setTimeout(() => {
      if (initialDocument.blank) {
        titleRef.current.focus()
      } else {
        restoreSelectionForEditor()
      }

      restoreScroll(initialDocument.id)
    }, 0)
  }, [])

  useSaveSelection(initialDocument.id, editor)
  useSaveScroll(initialDocument.id)

  const [forceUpdateBodyKey, forceUpdateBody] = useReducer(x => x + 1, 0)

  useGlobalEvent('s3File:uploadComplete', () => forceUpdateBody())

  useEffectAfterFirst(() => {
    debouncedUpdateBody(editor)
  }, [editor.children, forceUpdateBodyKey])

  const formattingToolbar = useFormattingToolbar(
    <FormattingToolbar editor={editor} />
  )

  return formattingToolbar
}

export default Editor
