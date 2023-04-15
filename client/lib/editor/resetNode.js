import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_PARAGRAPH,
  isSelectionAtBlockStart,
  isSelectionAtCodeBlockStart,
  unwrapCodeBlock,
} from '@udecode/plate-headless';

const commonRule = {
  defaultType: ELEMENT_PARAGRAPH,
  hotkey: 'backspace',
};

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
};

export default resetNodeOptions;
