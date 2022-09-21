import {
  createSoftBreakPlugin,
  createResetNodePlugin,
  createExitBreakPlugin,
  isSelectionAtBlockStart,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  KEYS_HEADING,
} from '@udecode/plate-headless'

const behaviourPlugins = [
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
]

export default behaviourPlugins
