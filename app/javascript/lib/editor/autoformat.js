import {
  createAutoformatPlugin,
  getParentNode,
  isType,
  toggleList,
  unwrapList,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
} from '@udecode/plate-headless'

const blockBaseRule = {
  mode: 'block',
  preFormat: editor => unwrapList(editor),
}

const markBaseRule = {
  mode: 'mark',
}

const unlessCodeBlock = f => editor => {
  const [node] = getParentNode(editor, editor.selection)

  if (!isType(editor, node, ELEMENT_CODE_BLOCK)) {
    f(editor)
  }
}

const autoformatPlugins = [
  createAutoformatPlugin({
    options: {
      rules: [
        {
          ...blockBaseRule,
          type: ELEMENT_H1,
          match: '# ',
        },
        {
          ...blockBaseRule,
          type: ELEMENT_BLOCKQUOTE,
          match: '> ',
        },
        {
          ...blockBaseRule,
          type: ELEMENT_CODE_BLOCK,
          match: '```',
        },
        {
          ...blockBaseRule,
          type: ELEMENT_LI,
          match: ['* ', '- '],
          format: unlessCodeBlock(editor => toggleList(editor, { type: ELEMENT_UL })),
        },
        {
          ...blockBaseRule,
          type: ELEMENT_LI,
          match: ['1. ', '1) '],
          format: unlessCodeBlock(editor => toggleList(editor, { type: ELEMENT_OL })),
        },
        {
          ...markBaseRule,
          type: [MARK_BOLD, MARK_ITALIC],
          match: '***',
        },
        {
          ...markBaseRule,
          type: MARK_BOLD,
          match: '**',
        },
        {
          ...markBaseRule,
          type: MARK_ITALIC,
          match: ['*', '_'],
        },
        {
          ...markBaseRule,
          type: MARK_ITALIC,
          match: '_',
        },
        {
          ...markBaseRule,
          type: MARK_STRIKETHROUGH,
          match: '~',
        },
      ],
      enabledUndoOnDelete: true,
    },
  }),
]

export default autoformatPlugins
