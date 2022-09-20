import React, { useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import TextareaAutosize from 'react-textarea-autosize'
import {
  Plate,
  createPlateEditor,
  deserializeHtml,
  createPlugins,
  createParagraphPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createLinkPlugin,
  createHeadingPlugin,
  createBlockquotePlugin,
  createCodeBlockPlugin,
  createListPlugin,
  ELEMENT_PARAGRAPH,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  ELEMENT_LINK,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
} from '@udecode/plate-headless'

import { useContext } from '~/lib/context'
import { LinkComponent } from '~/lib/editorLinkUtils'

import FormattingToolbar from '~/components/layout/FormattingToolbar'

const Editor = ({ workingDocument, updateDocument }) => {
  const { formattingToolbarRef } = useContext()
  const titleRef = useRef()

  const makeElementComponent = (Component, props = {}) => ({ children, nodeProps = {} }) => (
    <Component
      {...nodeProps}
      {...props}
      children={children}
    />
  )

  const plugins = createPlugins([
    createParagraphPlugin(),
    createBoldPlugin(),
    createItalicPlugin(),
    createStrikethroughPlugin(),
    createLinkPlugin(),
    createHeadingPlugin({ options: { levels: 1 } }),
    createBlockquotePlugin(),
    createCodeBlockPlugin(),
    createListPlugin(),
  ], {
    components: {
      [ELEMENT_PARAGRAPH]: makeElementComponent('p'),
      [MARK_BOLD]: makeElementComponent('strong'),
      [MARK_ITALIC]: makeElementComponent('em'),
      [MARK_STRIKETHROUGH]: makeElementComponent('del'),
      [ELEMENT_LINK]: LinkComponent,
      [ELEMENT_H1]: makeElementComponent('h1'),
      [ELEMENT_BLOCKQUOTE]: makeElementComponent('blockquote'),
      [ELEMENT_CODE_BLOCK]: makeElementComponent('pre'),
      [ELEMENT_UL]: makeElementComponent('ul'),
      [ELEMENT_OL]: makeElementComponent('ol'),
      [ELEMENT_LI]: makeElementComponent('li'),
    },
  })

  const { initialEditor, initialValue } = useMemo(() => {
    const initialEditor = createPlateEditor({ id: 'editor', plugins })
    
    const initialValue = workingDocument.body_content
      ? deserializeHtml(initialEditor, { element: workingDocument.body_content })
      : [{ children: [{ text: '' }] }]

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
        children={createPortal(
          <FormattingToolbar />,
          formattingToolbarRef.current,
        )}
      />
    </>
  )
}

export default Editor
