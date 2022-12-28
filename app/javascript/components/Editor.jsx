import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plate,
  createPlateEditor,
  usePlateEditorState,
  deserializeHtml,
  ELEMENT_PARAGRAPH,
} from '@udecode/plate-headless'

import { useContext, ContextProvider } from '~/lib/context'
import { useGlobalEvent } from '~/lib/globalEvents'
import { overviewPath } from '~/lib/routes'
import useEffectAfterFirst from '~/lib/useEffectAfterFirst'
import usePlugins from '~/lib/editor/plugins'
import { useLinkModalProvider } from '~/lib/editor/links'
import filterDescendants from '~/lib/editor/filterDescendants'
import getPlainBody from '~/lib/editor/getPlainBody'
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

const Editor = ({ workingDocument, updateDocument }) => {
  const titleRef = useRef()
  const tagsRef = useRef()
  const tippyContainerRef = useRef()
  const mentionSuggestionsContainerRef = useRef()
  const editorElementRef = useRef()
  const editorRef = useRef()

  useEffect(() => {
    editorElementRef.current = document.querySelector('[data-slate-editor]')
  }, [])

  const { projectId, topBarHeight } = useContext()

  const [tagsVisible, setTagsVisible] = useState(workingDocument.tags.length > 0)

  const navigate = useNavigate()

  useGlobalEvent('document:delete', ({ documentId }) => {
    if (documentId === workingDocument.id) {
      navigate(overviewPath(projectId))
    }
  })

  const { findDialog, findOptions, openFind } = useFind({
    editorRef,
    restoreSelection: () => restoreSelection(workingDocument.id, editorRef.current),
    setSelection: selection => setSelection(editorRef.current, selection),
  })

  const plugins = usePlugins({ findOptions })

  const initialValue = useMemo(() => {
    const bodyFormat = workingDocument.body_type.split('/')[0]
    const emptyDocument = [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]

    switch (bodyFormat) {
      case 'empty':
        return emptyDocument

      case 'html':
        const tempEditor = createPlateEditor({ plugins })

        const initialValue = deserializeHtml(tempEditor, {
          element: workingDocument.body,
          stripWhitespace: true,
        })

        return initialValue[0]?.type ? initialValue : emptyDocument

      case 'json':
        return JSON.parse(workingDocument.body)

      default:
        throw new Error(`Unknown body format: ${bodyFormat}`)
    }
  }, [])

  const documentMenu = (
    <DocumentMenu
      document={workingDocument}
      updateDocument={updateDocument}
      incrementRemoteVersion={false}
      openFind={openFind}
      showReplace
    />
  )

  const withLinkModalProvider = useLinkModalProvider()

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
            className="min-w-0 grow h1 text-black dark:text-white"
            value={workingDocument.title || ''}
            placeholder="Untitled document"
            onChange={event => updateDocument({
              title: event.target.value.replace(/[\n\r]+/g, ''),
            })}
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
          tippyContainerRef={tippyContainerRef}
          mentionSuggestionsContainerRef={mentionSuggestionsContainerRef}
          linkOriginator={workingDocument.safe_title}
        >
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
              workingDocument={workingDocument}
              updateDocument={updateDocument}
              titleRef={titleRef}
              editorElementRef={editorElementRef}
              editorRef={editorRef}
            />
          </Plate>
        </ContextProvider>
      )}

      <div ref={tippyContainerRef} />
      <div ref={mentionSuggestionsContainerRef} />
    </>
  )
}

const WithEditorState = ({ workingDocument, updateDocument, titleRef, editorElementRef, editorRef }) => {
  const editor = usePlateEditorState('editor')
  const { useFormattingToolbar } = useContext()

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  useEffect(() => {
    setTimeout(() => {
      if (workingDocument.blank) {
        titleRef.current.focus()
      } else {
        restoreSelection(workingDocument.id, editor)
      }

      restoreScroll(workingDocument.id)
    }, 0)
  }, [])

  useSaveSelection(workingDocument.id, editor)
  useSaveScroll(workingDocument.id)

  useEffectAfterFirst(() => {
    const filteredEditor = filterDescendants(editor, ({ type }) => type !== 'mention_input')

    updateDocument({
      body: JSON.stringify(filteredEditor.children),
      body_type: 'json/slate',
      plain_body: getPlainBody(filteredEditor),
    })
  }, [editor.children])

  const formattingToolbar = useFormattingToolbar(
    <FormattingToolbar editor={editor} />
  )

  return formattingToolbar
}

export default Editor
