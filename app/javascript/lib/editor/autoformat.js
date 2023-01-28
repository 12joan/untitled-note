import {
  toggleList,
  unwrapList,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
} from '@udecode/plate-headless'

const blockRule = (type, match, otherProps = {}) => ({
  mode: 'block',
  type,
  match,
  preFormat: editor => unwrapList(editor),
  ...otherProps,
})

const markRule = (type, match, otherProps = {}) => ({
  mode: 'mark',
  type,
  match,
  ...otherProps,
})

const autoformatOptions = {
  options: {
    rules: [
      blockRule(ELEMENT_H1, '# '),
      blockRule(ELEMENT_BLOCKQUOTE, '> '),
      blockRule(ELEMENT_CODE_BLOCK, '```'),
      blockRule(ELEMENT_LI, ['* ', '- '], {
        format: editor => toggleList(editor, { type: ELEMENT_UL }),
      }),
      blockRule(ELEMENT_LI, ['1. ', '1) '], {
        format: editor => toggleList(editor, { type: ELEMENT_OL }),
      }),
      markRule([MARK_BOLD, MARK_ITALIC], '***'),
      markRule(MARK_BOLD, '**'),
      markRule(MARK_ITALIC, ['*', '_']),
      markRule(MARK_STRIKETHROUGH, '~'),
    ],
    enabledUndoOnDelete: true,
  },
}

export default autoformatOptions
