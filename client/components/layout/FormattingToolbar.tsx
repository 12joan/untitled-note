import React from 'react'
import {
  getPluginType,
  someNode,
  toggleNodeType,
  isMarkActive,
  toggleMark,
  toggleList,
  toggleCodeBlock,
  indentListItems,
  unindentListItems,
  isRangeAcrossBlocks,
  getSelectionText,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_CODE,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_UL,
  ELEMENT_OL,
  PlateEditor,
} from '@udecode/plate-headless'

import { useKeyboardShortcut } from '~/lib/useKeyboardShortcut'
import { isLinkInSelection, useToggleLink } from '~/lib/editor/links'

import { Tooltip } from '~/components/Tooltip'
import BoldIcon from '~/components/icons/formatting/BoldIcon'
import ItalicIcon from '~/components/icons/formatting/ItalicIcon'
import StrikethroughIcon from '~/components/icons/formatting/StrikethroughIcon'
import CodeIcon from '~/components/icons/formatting/CodeIcon'
import LinkIcon from '~/components/icons/formatting/LinkIcon'
import HeadingOneIcon from '~/components/icons/formatting/HeadingOneIcon'
import QuoteIcon from '~/components/icons/formatting/QuoteIcon'
import CodeBlockIcon from '~/components/icons/formatting/CodeBlockIcon'
import BulletedListIcon from '~/components/icons/formatting/BulletedListIcon'
import NumberedListIcon from '~/components/icons/formatting/NumberedListIcon'
import IndentIcon from '~/components/icons/formatting/IndentIcon'
import UnindentIcon from '~/components/icons/formatting/UnindentIcon'

export interface FormattingToolbarProps {
  editor: PlateEditor;
}

export const FormattingToolbar = ({ editor }: FormattingToolbarProps) => {
  const toggleLink = useToggleLink(editor)

  const toggleElementProps = (element: string) => {
    const pluginType = getPluginType(editor, element)

    return {
      active: someNode(editor, { match: { type: pluginType } }),
      onClick: () => toggleNodeType(editor, { activeType: pluginType }),
    }
  }

  const toggleMarkProps = (mark: string) => {
    const pluginType = getPluginType(editor, mark)

    return {
      active: isMarkActive(editor, pluginType),
      onClick: () => toggleMark(editor, { key: pluginType }),
    }
  }

  const toggleListProps = (listType: string) => {
    const pluginType = getPluginType(editor, listType)

    return {
      active: someNode(editor, { match: { type: pluginType } }),
      onClick: () => toggleList(editor, { type: pluginType }),
    }
  }

  const toggleCodeBlockProps = () => {
    const pluginType = getPluginType(editor, ELEMENT_CODE_BLOCK)

    return {
      active: someNode(editor, { match: { type: pluginType } }),
      onClick: () => toggleCodeBlock(editor),
    }
  }

  // Meta+K toggles link only if there is a selection;
  // otherwise it opens the search modal
  useKeyboardShortcut(
    () => document.querySelector('[data-slate-editor]')!,
    ['MetaShiftU', 'MetaK'],
    (event, key) => {
      const hasSelection = getSelectionText(editor).length > 0

      if (key === 'MetaShiftU' || (key === 'MetaK' && hasSelection)) {
        event.preventDefault()
        toggleLink()
      }
    },
    [editor]
  )

  const linkInSelection = isLinkInSelection(editor)

  const formattingButtons = [
    { label: 'Bold', icon: BoldIcon, ...toggleMarkProps(MARK_BOLD) },
    { label: 'Italic', icon: ItalicIcon, ...toggleMarkProps(MARK_ITALIC) },
    { label: 'Strikethrough', icon: StrikethroughIcon, ...toggleMarkProps(MARK_STRIKETHROUGH) },
    { label: 'Inline code', icon: CodeIcon, ...toggleMarkProps(MARK_CODE) },
    {
      label: linkInSelection ? 'Remove link' : 'Add link',
      active: linkInSelection,
      icon: LinkIcon,
      disabled: isRangeAcrossBlocks(editor, { at: editor.selection }),
      onClick: toggleLink,
    },
    { label: 'Heading 1', icon: HeadingOneIcon, ...toggleElementProps(ELEMENT_H1) },
    { label: 'Quote', icon: QuoteIcon, ...toggleElementProps(ELEMENT_BLOCKQUOTE) },
    { label: 'Code block', icon: CodeBlockIcon, ...toggleCodeBlockProps() },
    { label: 'Bulleted list', icon: BulletedListIcon, ...toggleListProps(ELEMENT_UL) },
    { label: 'Numbered list', icon: NumberedListIcon, ...toggleListProps(ELEMENT_OL) },
    { label: 'Indent', icon: IndentIcon, onClick: () => indentListItems(editor) },
    { label: 'Unindent', icon: UnindentIcon, onClick: () => unindentListItems(editor) },
  ]

  return (
    <div className="my-auto space-y-2">
      {formattingButtons.map(({ label, icon: Icon, active, onClick, disabled = false }, index) => (
        <Tooltip key={index} content={label} placement="left" fixed>
          <button
            type="button"
            className="block btn p-3 aspect-square text-center disabled:opacity-50 disabled:cursor-not-allowed data-active:text-primary-500 dark:data-active:text-primary-400"
            data-active={active}
            disabled={disabled}
            onClick={onClick}
            onMouseDown={event => event.preventDefault()}
          >
            <Icon size="1.25em" ariaLabel={label} className={active ? 'stroke-[0.5] stroke-current' : undefined} />
          </button>
        </Tooltip>
      ))}
    </div>
  )
}
