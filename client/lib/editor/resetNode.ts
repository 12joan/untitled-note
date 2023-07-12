import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_PARAGRAPH,
  isSelectionAtBlockStart,
  isSelectionAtCodeBlockStart,
  ResetNodePlugin,
  unwrapCodeBlock,
} from '@udecode/plate';

const commonRule = {
  defaultType: ELEMENT_PARAGRAPH,
  hotkey: 'backspace',
};

export const resetNodeOptions: {
  options: ResetNodePlugin;
} = {
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
