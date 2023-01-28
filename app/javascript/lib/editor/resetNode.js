import {
  isSelectionAtBlockStart,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
} from '@udecode/plate-headless'

const resetNodeOptions = {
  options: {
    disableEditorReset: true,
    disableFirstBlockReset: true,
    rules: [
      {
        types: [ELEMENT_H1, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK],
        defaultType: ELEMENT_PARAGRAPH,
        hotkey: 'backspace',
        predicate: isSelectionAtBlockStart,
      },
    ],
  },
}

export default resetNodeOptions
