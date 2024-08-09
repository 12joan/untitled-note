import {
  AutoformatBlockRule,
  AutoformatMarkRule,
  AutoformatPlugin,
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
  PlateEditor,
  toggleCodeBlock,
  toggleList,
  unwrapList,
} from '~/lib/editor/plate';

const isSelectionInCodeBlock = (editor: PlateEditor): boolean =>
  !!getAboveNode(editor, { match: { type: ELEMENT_CODE_BLOCK } });

const blockRule = (
  type: AutoformatBlockRule['type'],
  match: AutoformatBlockRule['match'],
  otherProps: Partial<AutoformatBlockRule> = {}
): AutoformatBlockRule => ({
  mode: 'block',
  type,
  match,
  preFormat: unwrapList,
  query: (editor) => editor.style !== 'mono' && !isSelectionInCodeBlock(editor),
  ...otherProps,
});

const markRule = (
  type: AutoformatMarkRule['type'],
  match: AutoformatMarkRule['match'],
  otherProps: Partial<AutoformatMarkRule> = {}
): AutoformatMarkRule => ({
  mode: 'mark',
  type,
  match,
  query: (editor) => editor.style !== 'mono' && !isSelectionInCodeBlock(editor),
  ...otherProps,
});

export const autoformatOptions: {
  options: AutoformatPlugin;
} = {
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
    enableUndoOnDelete: true,
  },
};
