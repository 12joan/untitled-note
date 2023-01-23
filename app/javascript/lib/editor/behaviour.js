import { useMemo } from 'react'
import {
  createSoftBreakPlugin,
  createResetNodePlugin,
  createExitBreakPlugin,
  createTrailingBlockPlugin,
  isSelectionAtBlockStart,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  KEYS_HEADING,
} from '@udecode/plate-headless'

import { createImperativeEventsPlugin } from '~/lib/editor/imperativeEvents'

const useBehaviourPlugins = () => useMemo(() => [
  createSoftBreakPlugin({
    options: {
      rules: [
        {
          hotkey: 'shift+enter',
        },
        {
          hotkey: 'enter',
          query: {
            allow: [ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK],
          },
        },
      ],
    },
  }),
  createResetNodePlugin({
    options: {
      rules: [
        {
          types: [ELEMENT_H1, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK],
          defaultType: ELEMENT_PARAGRAPH,
          hotkey: 'backspace',
          predicate: isSelectionAtBlockStart,
        },
      ],
    },
  }),
  createExitBreakPlugin({
    options: {
      rules: [
        {
          hotkey: 'mod+enter',
        },
        {
          hotkey: 'mod+shift+enter',
          before: true,
        },
        {
          hotkey: 'enter',
          query: {
            start: true,
            end: true,
            allow: KEYS_HEADING,
          },
        },
      ],
    },
  }),
  createTrailingBlockPlugin(),
  createImperativeEventsPlugin(),
], [])

export default useBehaviourPlugins
