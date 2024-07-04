import { useMemo } from 'react';
import { useAttachmentPlugins } from '~/lib/editor/attachments';
import { autoformatOptions } from '~/lib/editor/autoformat';
import { codeBlockOptions } from '~/lib/editor/codeBlock';
import { components } from '~/lib/editor/components';
import { exitBreakOptions } from '~/lib/editor/exitBreak';
import { useImperativeEventsPlugins } from '~/lib/editor/imperativeEvents';
import { createMarkAffinityPlugin } from '~/lib/editor/markAffinity';
import { mentionOptions } from '~/lib/editor/mentions';
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
  PlatePlugin,
} from '~/lib/editor/plate';
import { resetNodeOptions } from '~/lib/editor/resetNode';
import { createSelectionToolbarPlugin } from '~/lib/editor/selectionToolbar';
import { softBreakOptions } from '~/lib/editor/softBreak';
import { createSplitInsertedDataIntoParagraphsPlugin } from '~/lib/editor/splitInsertedDataIntoParagraphs';
import { tabbableOptions } from '~/lib/editor/tabbable';

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
      createMentionPlugin(mentionOptions),
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
