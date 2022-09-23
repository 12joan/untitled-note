import React from 'react'
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

import { LinkComponent } from '~/lib/editor/links'

const typographyPlugins = [
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
]

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
}

export { typographyPlugins, components }