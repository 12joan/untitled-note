import { useMemo } from 'react'
import {
  createSoftBreakPlugin,
  createResetNodePlugin,
  createExitBreakPlugin,
  createTrailingBlockPlugin,
  createAutoformatPlugin,
  isSelectionAtBlockStart,
  toggleList,
  unwrapList,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
  KEYS_HEADING,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
} from '@udecode/plate-headless'

import { createSplitInsertedDataIntoParagraphsPlugin } from '~/lib/editor/splitInsertedDataIntoParagraphs'
import { createImperativeEventsPlugin } from '~/lib/editor/imperativeEvents'

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
  createAutoformatPlugin({
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
  }),
  createSplitInsertedDataIntoParagraphsPlugin(),
  createImperativeEventsPlugin(),
], [])

export default useBehaviourPlugins
