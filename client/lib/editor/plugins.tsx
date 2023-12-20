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
import { groupedClassNames } from '../groupedClassNames';
import { createSelectionToolbarPlugin } from './selectionToolbar';

const makeElementComponent =
  (Component: ElementType, className?: string) =>
  ({ children, nodeProps = {}, attributes }: PlateRenderElementProps) =>
    (
      <Component
        {...nodeProps}
        {...attributes}
        className={className}
        children={children}
      />
    );

const listStyle =
  'pl-[calc(1.5em+var(--list-style-offset,1ch))] marker:em:text-lg/none slate-top-level:list-overflow';
const codeStyle = 'bg-plain-800 dark:bg-plain-950 text-white em:text-sm';

const components = {
  [ELEMENT_PARAGRAPH]: makeElementComponent('p'),
  [MARK_BOLD]: makeElementComponent('strong', 'font-semibold'),
  [MARK_ITALIC]: makeElementComponent('em'),
  [MARK_STRIKETHROUGH]: makeElementComponent('del'),
  [MARK_CODE]: makeElementComponent(
    'code',
    groupedClassNames({
      code: codeStyle,
      rounded: 'rounded',
      padding: 'em:px-1.5 em:py-1',
    })
  ),
  [ELEMENT_LINK]: LinkComponent,
  [ELEMENT_H1]: makeElementComponent(
    'h1',
    groupedClassNames({
      fontWeight: 'font-medium',
      fontSize: 'slate-string:em:text-xl slate-string:sm:em:text-2xl',
      leading: 'slate-string:reset-leading',
    })
  ),
  [ELEMENT_BLOCKQUOTE]: makeElementComponent(
    'blockquote',
    groupedClassNames({
      padding: 'em:pl-4',
      text: 'italic',
      linePosition:
        'relative after:absolute after:left-0 after:inset-y-0 after:em:w-1',
      lineColor: 'after:bg-plain-200 after:dark:bg-plain-700',
      lineStyle: 'after:rounded-full',
    })
  ),
  [ELEMENT_CODE_BLOCK]: makeElementComponent(
    'pre',
    groupedClassNames({
      code: codeStyle,
      rounded: 'rounded-md',
      padding: 'em:px-5 em:py-4',
      overflow: 'overflow-x-auto',
    })
  ),
  [ELEMENT_UL]: makeElementComponent(
    'ul',
    groupedClassNames({
      list: listStyle,
      unorderedList:
        'list-disc marker:text-plain-300 dark:marker:text-plain-600',
    })
  ),
  [ELEMENT_OL]: makeElementComponent(
    'ol',
    groupedClassNames({
      list: listStyle,
      orderedList:
        'list-decimal marker:text-plain-500 dark:marker:text-plain-400',
    })
  ),
  [ELEMENT_LI]: makeElementComponent('li', 'em:pl-1.5'),
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
      createSelectionToolbarPlugin(),
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
