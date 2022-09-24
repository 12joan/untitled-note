import React, { useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Plate,
  createPlateEditor,
  usePlateEditorState,
  getNodeTexts,
  deserializeHtml,
  ELEMENT_PARAGRAPH,
} from '@udecode/plate-headless'

import { useContext, ContextProvider } from '~/lib/context'
import { useGlobalEvent } from '~/lib/globalEvents'
import { projectPath } from '~/lib/routes'
import useEffectAfterFirst from '~/lib/useEffectAfterFirst'
import plugins from '~/lib/editor/plugins'

import BackButton from '~/components/BackButton'
import Dropdown from '~/components/Dropdown'
import DocumentMenu from '~/components/DocumentMenu'
import FormattingToolbar from '~/components/layout/FormattingToolbar'
import DocumentMenuIcon from '~/components/icons/DocumentMenuIcon'

const Editor = ({ workingDocument, updateDocument }) => {
  const titleRef = useRef()
  const tippyContainerRef = useRef()
  const navigate = useNavigate()
  const { projectId } = useContext()

  useGlobalEvent('document:delete', ({ documentId }) => {
    if (documentId === workingDocument.id) {
      navigate(projectPath(projectId))
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

    return {
      initialEditor,
      initialValue: initialValue.length === 0 ? emptyDocument : initialValue,
    }
  }, [])

  const documentMenu = (
    <DocumentMenu
      document={workingDocument}
      updateDocument={updateDocument}
      incrementRemoteVersion={false}
    />
  )

  return (
    <>
      <div className="narrow mb-3">
        <BackButton />
      </div>

      <div className="cursor-text" onClick={() => titleRef.current.focus()}>
        <div className="narrow flex gap-2">
          <TextareaAutosize
            ref={titleRef}
            type="text"
            className="grow block min-w-0 text-3xl font-medium text-black dark:text-white overflow-wrap-break-word no-focus-ring resize-none bg-transparent"
            value={workingDocument.title || ''}
            placeholder="Untitled document"
            onChange={event => updateDocument({
              title: event.target.value.replace(/[\n\r]+/g, ''),
            })}
          />

          <div onClick={event => event.stopPropagation()}>
            <Dropdown items={documentMenu} placement="bottom-end">
              <button type="button" className="btn btn-transparent p-2 aspect-square">
                <DocumentMenuIcon size="1.25em" ariaLabel="Document menu" />
              </button>
            </Dropdown>
          </div>
        </div>
      </div>

      <ContextProvider tippyContainerRef={tippyContainerRef}>
        <Plate
          id="editor"
          editor={initialEditor}
          initialValue={initialValue}
          normalizeInitialValue
          editableProps={{
            className: 'grow prose prose-slate dark:prose-invert max-w-none text-black dark:text-white text-lg no-focus-ring children:narrow pb-[50vh]',
            placeholder: 'Write something...',
          }}
        >
          <WithEditorState
            workingDocument={workingDocument}
            updateDocument={updateDocument}
          />
        </Plate>
      </ContextProvider>

      <div ref={tippyContainerRef} />
    </>
  )
}

const WithEditorState = ({ workingDocument, updateDocument }) => {
  const editor = usePlateEditorState('editor')
  const { formattingToolbarRef } = useContext()

  useEffectAfterFirst(() => {
    const plainBody = Array.from(getNodeTexts(editor))
      .map(([{ text }]) => text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    updateDocument({
      body: JSON.stringify(editor.children),
      body_type: 'json/slate',
      plain_body: plainBody,
    })
  }, [editor.children])

  return createPortal(
    <FormattingToolbar editor={editor} />,
    formattingToolbarRef.current,
  )
}

export default Editor
