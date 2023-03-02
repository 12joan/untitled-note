import {
  isSelectionAtBlockStart,
  isSelectionAtCodeBlockStart,
  unwrapCodeBlock,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
} from '@udecode/plate-headless'

const commonRule = {
  defaultType: ELEMENT_PARAGRAPH,
  hotkey: 'backspace',
}

const resetNodeOptions = {
  options: {
    disableEditorReset: true,
    disableFirstBlockReset: true,
    rules: [
      {
        ...commonRule,
        types: [ELEMENT_H1, ELEMENT_BLOCKQUOTE],
        predicate: isSelectionAtBlockStart,
      },
      {
        ...commonRule,
        types: [ELEMENT_CODE_BLOCK],
        predicate: isSelectionAtCodeBlockStart,
        onReset: unwrapCodeBlock,
      },
    ],
  },
}

export default resetNodeOptions
