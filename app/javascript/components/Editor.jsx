import React, { useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Plate,
  createPlateEditor,
  usePlateEditorState,
  getNodeTexts,
  deserializeHtml,
} from '@udecode/plate-headless'

import { useContext } from '~/lib/context'
import useEffectAfterFirst from '~/lib/useEffectAfterFirst'
import plugins from '~/lib/editor/plugins'

import FormattingToolbar from '~/components/layout/FormattingToolbar'

const Editor = ({ workingDocument, updateDocument }) => {
  const titleRef = useRef()

  const { initialEditor, initialValue } = useMemo(() => {
    const initialEditor = createPlateEditor({ id: 'editor', plugins })

    const bodyFormat = workingDocument.body_type.split('/')[0]

    const initialValue = {
      empty: () => [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
      html: body => deserializeHtml(initialEditor, {
        element: body,
        stripWhitespace: false,
      }),
      json: body => JSON.parse(body),
    }[bodyFormat](workingDocument.body)

    return { initialEditor, initialValue }
  }, [])

  return (
    <>
      <div className="cursor-text" onClick={() => titleRef.current.focus()}>
        <TextareaAutosize
          ref={titleRef}
          type="text"
          className="block mx-auto w-full min-w-0 max-w-screen-sm text-3xl font-medium text-black dark:text-white overflow-wrap-break-word no-focus-ring resize-none bg-transparent"
          value={workingDocument.title || ''}
          placeholder="Untitled document"
          onChange={event => updateDocument({
            title: event.target.value.replace(/[\n\r]+/g, ''),
          })}
        />
      </div>

      <Plate
        id="editor"
        editor={initialEditor}
        initialValue={initialValue}
        normalizeInitialValue
        editableProps={{
          className: 'grow pt-3 prose prose-slate dark:prose-invert max-w-none text-black dark:text-white text-lg no-focus-ring children:mx-auto children:max-w-screen-sm children:w-full',
          placeholder: 'Write something...',
        }}
      >
        <WithEditorState
          workingDocument={workingDocument}
          updateDocument={updateDocument}
        />
      </Plate>
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
