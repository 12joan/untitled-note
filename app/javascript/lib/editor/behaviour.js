import { useMemo } from 'react'
import {
  createSoftBreakPlugin,
  createResetNodePlugin,
  createExitBreakPlugin,
  createTrailingBlockPlugin,
  createAutoformatPlugin,
} from '@udecode/plate-headless'

import { createSplitInsertedDataIntoParagraphsPlugin } from '~/lib/editor/splitInsertedDataIntoParagraphs'
import { createImperativeEventsPlugin } from '~/lib/editor/imperativeEvents'
import softBreakOptions from '~/lib/editor/softBreak'
import resetNodeOptions from '~/lib/editor/resetNode'
import exitBreakOptions from '~/lib/editor/exitBreak'
import autoformatOptions from '~/lib/editor/autoformat'

const useBehaviourPlugins = () => useMemo(() => [
  createSoftBreakPlugin(softBreakOptions),
  createResetNodePlugin(resetNodeOptions),
  createExitBreakPlugin(exitBreakOptions),
  createTrailingBlockPlugin(),
  createAutoformatPlugin(autoformatOptions),
  createSplitInsertedDataIntoParagraphsPlugin(),
  createImperativeEventsPlugin(),
], [])

export default useBehaviourPlugins
