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
  useAttachmentPlugins,
  Attachment,
} from '~/lib/editor/attachments'

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

  return useMemo(() => [
    ...mainPlugins,
    ...attachmentPlugins
  ], [mainPlugins, attachmentPlugins])
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
}

export { useTypographyPlugins, components }
