import React, { useRef, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plate,
  createPlateEditor,
  usePlateEditorState,
  getNodeChildren,
  getNodeTexts,
  deserializeHtml,
  ELEMENT_PARAGRAPH,
} from '@udecode/plate-headless'

import { useContext, ContextProvider } from '~/lib/context'
import { useGlobalEvent } from '~/lib/globalEvents'
import { overviewPath } from '~/lib/routes'
import useEffectAfterFirst from '~/lib/useEffectAfterFirst'
import plugins from '~/lib/editor/plugins'
import { useLinkModalProvider } from '~/lib/editor/links'

import BackButton from '~/components/BackButton'
import Tooltip from '~/components/Tooltip'
import TextareaAutosize from '~/components/TextareaAutosize'
import Dropdown from '~/components/Dropdown'
import DocumentMenu from '~/components/DocumentMenu'
import EditorTags from '~/components/EditorTags'
import FormattingToolbar from '~/components/layout/FormattingToolbar'
import TagsIcon from '~/components/icons/TagsIcon'
import DocumentMenuIcon from '~/components/icons/DocumentMenuIcon'

const Editor = ({ workingDocument, updateDocument }) => {
  const titleRef = useRef()
  const tagsRef = useRef()
  const tippyContainerRef = useRef()

  const focusEditor = () => setTimeout(() => document.querySelector('[data-slate-editor]').focus(), 0)

  useEffect(() => {
    if (workingDocument.blank) {
      titleRef.current.focus()
    } else {
      focusEditor()
    }
  }, [])

  const { projectId } = useContext()

  const [tagsVisible, setTagsVisible] = useState(workingDocument.tags.length > 0)

  const navigate = useNavigate()

  useGlobalEvent('document:delete', ({ documentId }) => {
    if (documentId === workingDocument.id) {
      navigate(overviewPath(projectId))
    }
  })

  const { initialEditor, initialValue } = useMemo(() => {
    const initialEditor = createPlateEditor({ id: 'editor', plugins })

    const bodyFormat = workingDocument.body_type.split('/')[0]

    const emptyDocument = [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]

    const initialValue = {
      empty: () => emptyDocument,
      html: body => deserializeHtml(initialEditor, {
        element: body,
        stripWhitespace: false,
      }),
      json: body => JSON.parse(body),
    }[bodyFormat](workingDocument.body)

    const safeInitialValue = initialValue[0]?.type
      ? initialValue
      : emptyDocument

    return {
      initialEditor,
      initialValue: safeInitialValue,
    }
  }, [])

  const documentMenu = (
    <DocumentMenu
      document={workingDocument}
      updateDocument={updateDocument}
      incrementRemoteVersion={false}
    />
  )

  const withLinkModalProvider = useLinkModalProvider()

  return (
    <>
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
                focusEditor()
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
                <DocumentMenuIcon size="1.25em" ariaLabel="Document menu" />
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
        <ContextProvider tippyContainerRef={tippyContainerRef}>
          <Plate
            id="editor"
            editor={initialEditor}
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
            />
          </Plate>
        </ContextProvider>
      )}

      <div ref={tippyContainerRef} />
    </>
  )
}

const WithEditorState = ({ workingDocument, updateDocument }) => {
  const editor = usePlateEditorState('editor')
  const { useFormattingToolbar } = useContext()

  useEffectAfterFirst(() => {
    const plainBody = [...getNodeChildren(editor, [])]
      .map(([node]) => [...getNodeTexts(node)].map(([textNode]) => textNode.text).join(''))
      .join(' ')

    updateDocument({
      body: JSON.stringify(editor.children),
      body_type: 'json/slate',
      plain_body: plainBody,
    })
  }, [editor.children])

  const formattingToolbar = useFormattingToolbar(
    <FormattingToolbar editor={editor} />
  )

  return formattingToolbar
}

export default Editor
