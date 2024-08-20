import { useMemo } from 'react';
import { useAttachmentPlugins } from '~/lib/editor/attachments';
import { autoformatOptions } from '~/lib/editor/autoformat';
import { codeBlockOptions } from '~/lib/editor/codeBlock';
import { components } from '~/lib/editor/components';
import { exitBreakOptions } from '~/lib/editor/exitBreak';
import { useImperativeEventsPlugins } from '~/lib/editor/imperativeEvents';
import { createMarkAffinityPlugin } from '~/lib/editor/markAffinity';
import { createMentionPlugin } from '~/lib/editor/mentions';
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
  createParagraphPlugin,
  createPluginFactory,
  createPlugins,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTabbablePlugin,
  createTrailingBlockPlugin,
  ELEMENT_LIC,
  getBlockAbove,
  getNode,
  getNodeParent,
  isHotkey,
  isSelectionAtBlockStart,
  PlatePlugin,
  toDOMNode,
} from '~/lib/editor/plate';
import { resetNodeOptions } from '~/lib/editor/resetNode';
import { createSelectionToolbarPlugin } from '~/lib/editor/selectionToolbar';
import { softBreakOptions } from '~/lib/editor/softBreak';
import { createSplitInsertedDataIntoParagraphsPlugin } from '~/lib/editor/splitInsertedDataIntoParagraphs';
import { tabbableOptions } from '~/lib/editor/tabbable';

const createTodoPlugin = createPluginFactory({
  key: 'todo',
  isElement: true,
  handlers: {
    onKeyDown: (editor) => (event) => {
      if (!isHotkey('left', event)) return;

      const licEntry = getBlockAbove(editor, {
        match: { type: ELEMENT_LIC },
      });
      console.log(licEntry);
      if (!licEntry) return;

      const list = getNode(editor, licEntry[1].slice(0, -2));
      console.log(list);
      if (list.type !== 'todo') return;

      console.log('x');
      if (!isSelectionAtBlockStart(editor)) return;

      const licDomNode = toDOMNode(editor, licEntry[0]);
      console.log(licDomNode);
      licDomNode?.querySelector('input[type=checkbox]')?.focus();
    },
  },
});

export type PluginCategory = 'markup' | 'behaviour';

export interface UsePluginsOptions {
  enabledCategories?: Partial<Record<PluginCategory, boolean>>;
}

const disableHotkey = { hotkey: '' };

export const usePlugins = ({
  enabledCategories: {
    markup: markupEnabled = true,
    behaviour: behaviourEnabled = true,
  } = {},
}: UsePluginsOptions = {}) => {
  /**
   * It's important that the plugins are memoized, otherwise the editor will
   * re-render at inopportune moments. This causes bugs such as selection
   * jumping when blurring the find dialog.
   *
   * Known plugin order dependencies:
   * - Imperative events before blockquote
   */

  const imperativeEventsPlugins = useImperativeEventsPlugins();

  const staticMarkupPlugins: PlatePlugin[] = useMemo(
    () => [
      createParagraphPlugin(),
      createBoldPlugin({ options: disableHotkey }),
      createItalicPlugin({ options: disableHotkey }),
      createStrikethroughPlugin({ options: disableHotkey }),
      createCodePlugin({ options: disableHotkey }),
      createLinkPlugin(),
      createHeadingPlugin({ options: { levels: 1, ...disableHotkey } }),
      createBlockquotePlugin({ options: disableHotkey }),
      createCodeBlockPlugin({ ...codeBlockOptions, options: disableHotkey }),
      createListPlugin(),
      createTodoPlugin(),
      createMentionPlugin(),
    ],
    []
  );

  const staticBehaviourPlugins: PlatePlugin[] = useMemo(
    () => [
      createSoftBreakPlugin(softBreakOptions),
      createResetNodePlugin(resetNodeOptions),
      createExitBreakPlugin(exitBreakOptions),
      createTabbablePlugin(tabbableOptions),
      createTrailingBlockPlugin(),
      createAutoformatPlugin(autoformatOptions),
      createSplitInsertedDataIntoParagraphsPlugin(),
      createSelectionToolbarPlugin(),
      createMarkAffinityPlugin(),
    ],
    []
  );

  const attachmentPlugins = useAttachmentPlugins();

  return useMemo(
    () =>
      createPlugins(
        [
          ...(behaviourEnabled ? imperativeEventsPlugins : []),
          ...(markupEnabled ? staticMarkupPlugins : []),
          ...(behaviourEnabled ? staticBehaviourPlugins : []),
          ...(markupEnabled ? attachmentPlugins : []),
        ],
        {
          components,
        }
      ),
    [
      imperativeEventsPlugins,
      staticMarkupPlugins,
      staticBehaviourPlugins,
      attachmentPlugins,
    ]
  );
};
