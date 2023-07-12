import React, { ElementType, useMemo } from 'react';
import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMentionPlugin,
  createParagraphPlugin,
  createPlugins,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTabbablePlugin,
  createTrailingBlockPlugin,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_LI,
  ELEMENT_LINK,
  ELEMENT_MENTION,
  ELEMENT_MENTION_INPUT,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_UL,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  PlateRenderElementProps,
} from '@udecode/plate';
import {
  Attachment,
  ELEMENT_ATTACHMENT,
  useAttachmentPlugins,
} from '~/lib/editor/attachments';
import { autoformatOptions } from '~/lib/editor/autoformat';
import { codeBlockOptions } from '~/lib/editor/codeBlock';
import { exitBreakOptions } from '~/lib/editor/exitBreak';
import { useImperativeEventsPlugins } from '~/lib/editor/imperativeEvents';
import { LinkComponent } from '~/lib/editor/links';
import {
  MentionComponent,
  MentionInputComponent,
  mentionOptions,
} from '~/lib/editor/mentions';
import { resetNodeOptions } from '~/lib/editor/resetNode';
import { softBreakOptions } from '~/lib/editor/softBreak';
import { createSplitInsertedDataIntoParagraphsPlugin } from '~/lib/editor/splitInsertedDataIntoParagraphs';
import { tabbableOptions } from '~/lib/editor/tabbable';

const makeElementComponent =
  (Component: ElementType) =>
  ({ children, nodeProps = {}, attributes }: PlateRenderElementProps) =>
    <Component {...nodeProps} {...attributes} children={children} />;

const components = {
  [ELEMENT_PARAGRAPH]: makeElementComponent('p'),
  [MARK_BOLD]: makeElementComponent('strong'),
  [MARK_ITALIC]: makeElementComponent('em'),
  [MARK_STRIKETHROUGH]: makeElementComponent('del'),
  [MARK_CODE]: makeElementComponent('code'),
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
};

export const usePlugins = () => {
  /**
   * It's important that the plugins are memoized, otherwise the editor will
   * re-render at inopportune moments. This causes bugs such as selection
   * jumping when blurring the find dialog.
   *
   * Known plugin order dependencies:
   * - Imperative events before blockquote
   */

  const imperativeEventsPlugins = useImperativeEventsPlugins();

  const staticPlugins = useMemo(
    () => [
      createParagraphPlugin(),
      createBoldPlugin(),
      createItalicPlugin(),
      createStrikethroughPlugin(),
      createCodePlugin(),
      createLinkPlugin(),
      createHeadingPlugin({ options: { levels: 1 } }),
      createBlockquotePlugin(),
      createCodeBlockPlugin(codeBlockOptions),
      createListPlugin(),
      createMentionPlugin(mentionOptions),
      createSoftBreakPlugin(softBreakOptions),
      createResetNodePlugin(resetNodeOptions),
      createExitBreakPlugin(exitBreakOptions),
      createTabbablePlugin(tabbableOptions),
      createTrailingBlockPlugin(),
      createAutoformatPlugin(autoformatOptions),
      createSplitInsertedDataIntoParagraphsPlugin(),
    ],
    []
  );

  const attachmentPlugins = useAttachmentPlugins();

  return useMemo(
    () =>
      createPlugins(
        [...imperativeEventsPlugins, ...staticPlugins, ...attachmentPlugins],
        {
          components,
        }
      ),
    [imperativeEventsPlugins, staticPlugins, attachmentPlugins]
  );
};
