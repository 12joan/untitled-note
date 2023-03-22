import { useMemo, useEffect } from 'react'
import {
  createPlugins,
  createSoftBreakPlugin,
  createResetNodePlugin,
  createExitBreakPlugin,
  createTrailingBlockPlugin,
  createAutoformatPlugin,
  createTabbablePlugin,
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

import { createSplitInsertedDataIntoParagraphsPlugin } from '~/lib/editor/splitInsertedDataIntoParagraphs'
import { createImperativeEventsPlugin } from '~/lib/editor/imperativeEvents'
import codeBlockOptions from '~/lib/editor/codeBlock'
import softBreakOptions from '~/lib/editor/softBreak'
import resetNodeOptions from '~/lib/editor/resetNode'
import exitBreakOptions from '~/lib/editor/exitBreak'
import autoformatOptions from '~/lib/editor/autoformat'
import tabbableOptions from '~/lib/editor/tabbable'
import { LinkComponent } from '~/lib/editor/links'
import {
  MentionComponent,
  MentionInputComponent,
  mentionOptions,
} from '~/lib/editor/mentions'
import {
  ELEMENT_ATTACHMENT,
  useAttachmentPlugins,
  Attachment,
} from '~/lib/editor/attachments'

const makeElementComponent = (Component, props = {}) => ({ children, nodeProps = {}, attributes }) => (
  <Component
    {...nodeProps}
    {...attributes}
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

const usePlugins = options => {
  const attachmentPlugins = useAttachmentPlugins()

  /**
   * Known plugin order dependencies:
   * - Imperative events before blockquote
   */

  const pluginList = [
    useMemo(() => createImperativeEventsPlugin(), []),
    useMemo(() => createParagraphPlugin(), []),
    useMemo(() => createBoldPlugin(), []),
    useMemo(() => createItalicPlugin(), []),
    useMemo(() => createStrikethroughPlugin(), []),
    useMemo(() => createLinkPlugin(), []),
    useMemo(() => createHeadingPlugin({ options: { levels: 1 } }), []),
    useMemo(() => createBlockquotePlugin(), []),
    useMemo(() => createCodeBlockPlugin(codeBlockOptions), []),
    useMemo(() => createListPlugin(), []),
    useMemo(() => createMentionPlugin(mentionOptions), []),
    useMemo(() => createSoftBreakPlugin(softBreakOptions), []),
    useMemo(() => createResetNodePlugin(resetNodeOptions), []),
    useMemo(() => createExitBreakPlugin(exitBreakOptions), []),
    useMemo(() => createTabbablePlugin(tabbableOptions), []),
    useMemo(() => createTrailingBlockPlugin(), []),
    useMemo(() => createAutoformatPlugin(autoformatOptions), []),
    useMemo(() => createSplitInsertedDataIntoParagraphsPlugin(), []),
    ...attachmentPlugins,
  ]

  return useMemo(() => createPlugins(pluginList, {
    components,
  }), [pluginList])
}

export default usePlugins
