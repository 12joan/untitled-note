import { useMemo } from 'react'
import {
  createSoftBreakPlugin,
  createResetNodePlugin,
  createExitBreakPlugin,
  createTrailingBlockPlugin,
  createAutoformatPlugin,
  createTabbablePlugin,
} from '@udecode/plate-headless'

import { createSplitInsertedDataIntoParagraphsPlugin } from '~/lib/editor/splitInsertedDataIntoParagraphs'
import { createImperativeEventsPlugin } from '~/lib/editor/imperativeEvents'
import softBreakOptions from '~/lib/editor/softBreak'
import resetNodeOptions from '~/lib/editor/resetNode'
import exitBreakOptions from '~/lib/editor/exitBreak'
import autoformatOptions from '~/lib/editor/autoformat'
import tabbableOptions from '~/lib/editor/tabbable'

const useBehaviourPlugins = () => useMemo(() => [
  createSoftBreakPlugin(softBreakOptions),
  createResetNodePlugin(resetNodeOptions),
  createExitBreakPlugin(exitBreakOptions),
  createTabbablePlugin(tabbableOptions),
  createTrailingBlockPlugin(),
  createAutoformatPlugin(autoformatOptions),
  createSplitInsertedDataIntoParagraphsPlugin(),
  createImperativeEventsPlugin(),
], [])

export default useBehaviourPlugins
