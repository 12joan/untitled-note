import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_UL,
  getAboveNode,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  toggleCodeBlock,
  toggleList,
  unwrapList,
} from '@udecode/plate-headless';

const isSelectionInCodeBlock = (editor) =>
  !!getAboveNode(editor, { match: { type: ELEMENT_CODE_BLOCK } });

const blockRule = (type, match, otherProps = {}) => ({
  mode: 'block',
  type,
  match,
  preFormat: unwrapList,
  query: (editor) => !isSelectionInCodeBlock(editor),
  ...otherProps,
});

const markRule = (type, match, otherProps = {}) => ({
  mode: 'mark',
  type,
  match,
  query: (editor) => !isSelectionInCodeBlock(editor),
  ...otherProps,
});

const autoformatOptions = {
  options: {
    rules: [
      blockRule(ELEMENT_H1, '# '),
      blockRule(ELEMENT_BLOCKQUOTE, '> '),
      blockRule(ELEMENT_CODE_BLOCK, '```', {
        format: toggleCodeBlock,
      }),
      blockRule(ELEMENT_LI, ['* ', '- '], {
        format: (editor) => toggleList(editor, { type: ELEMENT_UL }),
      }),
      blockRule(ELEMENT_LI, ['1. ', '1) '], {
        format: (editor) => toggleList(editor, { type: ELEMENT_OL }),
      }),
      markRule([MARK_BOLD, MARK_ITALIC], '***'),
      markRule(MARK_BOLD, '**'),
      markRule(MARK_ITALIC, ['*', '_']),
      markRule(MARK_STRIKETHROUGH, '~'),
      markRule(MARK_CODE, '`'),
    ],
    enabledUndoOnDelete: true,
  },
};

export default autoformatOptions;
