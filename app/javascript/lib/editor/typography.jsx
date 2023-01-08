import React, { useMemo } from 'react'
import {
  createParagraphPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createLinkPlugin,
  createHeadingPlugin,
  createBlockquotePlugin,
  createCodeBlockPlugin,
  createListPlugin,
  createMentionPlugin,
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
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
} from '@udecode/plate-headless'

import { LinkComponent } from '~/lib/editor/links'
import { MentionComponent, MentionInputComponent } from '~/lib/editor/mentions'
import {
  ELEMENT_ATTACHMENT,
  ELEMENT_UPLOADING_ATTACHMENT,
  useAttachmentPlugins,
  Attachment,
  UploadingAttachment,
} from '~/lib/editor/attachments'
import { MARK_FIND_RESULT, MARK_FIND_RESULT_CURRENT } from '~/lib/editor/find'

const useTypographyPlugins = () => {
  const mainPlugins = useMemo(() => [
    createParagraphPlugin(),
    createBoldPlugin(),
    createItalicPlugin(),
    createStrikethroughPlugin(),
    createLinkPlugin(),
    createHeadingPlugin({ options: { levels: 1 } }),
    createBlockquotePlugin(),
    createCodeBlockPlugin({
      deserializeHtml: {
        rules: [
          {
            validNodeName: 'PRE',
          },
        ],
        getNode: el => ({
          type: ELEMENT_CODE_BLOCK,
          children: [{ text: el.textContent }],
        }),
      },
    }),
    createListPlugin(),
    createMentionPlugin({
      options: {
        createMentionNode: x => x,
      },
    }),
  ], [])

  const attachmentPlugins = useAttachmentPlugins()

  return [...mainPlugins, ...attachmentPlugins]
}

const makeElementComponent = (Component, props = {}) => ({ children, nodeProps = {} }) => (
  <Component
    {...nodeProps}
    {...props}
    children={children}
  />
)

const components = {
  [ELEMENT_PARAGRAPH]: makeElementComponent('p'),
  [MARK_BOLD]: makeElementComponent('strong'),
  [MARK_ITALIC]: makeElementComponent('em'),
  [MARK_STRIKETHROUGH]: makeElementComponent('del'),
  [MARK_FIND_RESULT]: makeElementComponent('mark', { className: 'bg-yellow-100/80 dark:bg-white/80 text-black not-prose' }),
  [MARK_FIND_RESULT_CURRENT]: makeElementComponent('mark', { className: 'bg-yellow-300 text-black not-prose' }),
  [ELEMENT_LINK]: LinkComponent,
  [ELEMENT_H1]: makeElementComponent('h1'),
  [ELEMENT_BLOCKQUOTE]: makeElementComponent('blockquote'),
  [ELEMENT_CODE_BLOCK]: makeElementComponent('pre'),
  [ELEMENT_UL]: makeElementComponent('ul'),
  [ELEMENT_OL]: makeElementComponent('ol'),
  [ELEMENT_LI]: makeElementComponent('li'),
  [ELEMENT_MENTION]: MentionComponent,
  [ELEMENT_MENTION_INPUT]: MentionInputComponent,
  [ELEMENT_ATTACHMENT]: Attachment,
  [ELEMENT_UPLOADING_ATTACHMENT]: UploadingAttachment,
}

export { useTypographyPlugins, components }
