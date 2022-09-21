import React from 'react'
import {
  getPluginType,
  someNode,
  toggleNodeType,
  isMarkActive,
  toggleMark,
  toggleList,
  indentListItems,
  unindentListItems,
  useHotkeys,
  isRangeAcrossBlocks,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  ELEMENT_H1,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_UL,
  ELEMENT_OL,
  ELEMENT_LI,
} from '@udecode/plate-headless'

import { isLinkInSelection, toggleLink } from '~/lib/editor/links'

import Tooltip from '~/components/Tooltip'
import BoldIcon from '~/components/icons/formatting/BoldIcon'
import ItalicIcon from '~/components/icons/formatting/ItalicIcon'
import StrikethroughIcon from '~/components/icons/formatting/StrikethroughIcon'
import LinkIcon from '~/components/icons/formatting/LinkIcon'
import HeadingOneIcon from '~/components/icons/formatting/HeadingOneIcon'
import QuoteIcon from '~/components/icons/formatting/QuoteIcon'
import CodeBlockIcon from '~/components/icons/formatting/CodeBlockIcon'
import BulletedListIcon from '~/components/icons/formatting/BulletedListIcon'
import NumberedListIcon from '~/components/icons/formatting/NumberedListIcon'
import IndentIcon from '~/components/icons/formatting/IndentIcon'
import UnindentIcon from '~/components/icons/formatting/UnindentIcon'

const FormattingToolbar = ({ editor }) => {
  const toggleElementProps = element => {
    const pluginType = getPluginType(editor, element)

    return {
      active: someNode(editor, { match: { type: pluginType } }),
      onClick: () => toggleNodeType(editor, { activeType: pluginType }),
    }
  }

  const toggleMarkProps = mark => {
    const pluginType = getPluginType(editor, mark)

    return {
      active: isMarkActive(editor, pluginType),
      onClick: () => toggleMark(editor, { key: pluginType }),
    }
  }

  const toggleListProps = listType => {
    const pluginType = getPluginType(editor, listType)

    return {
      active: someNode(editor, { match: { type: pluginType } }),
      onClick: () => toggleList(editor, { type: pluginType }),
    }
  }

  const linkInSelection = isLinkInSelection(editor)

  useHotkeys(
    'command+k, ctrl+k',
    event => {
      event.preventDefault()
      toggleLink(editor)
    },
    { enableOnContentEditable: true },
    [linkInSelection, editor]
  )

  const formattingButtons = [
    { label: 'Bold', icon: BoldIcon, ...toggleMarkProps(MARK_BOLD) },
    { label: 'Italic', icon: ItalicIcon, ...toggleMarkProps(MARK_ITALIC) },
    { label: 'Strikethrough', icon: StrikethroughIcon, ...toggleMarkProps(MARK_STRIKETHROUGH) },
    {
      label: linkInSelection ? 'Remove link' : 'Add link',
      active: linkInSelection,
      icon: LinkIcon,
      disabled: isRangeAcrossBlocks(editor, { at: editor.selection }),
      onClick: () => toggleLink(editor),
    },
    { label: 'Heading 1', icon: HeadingOneIcon, ...toggleElementProps(ELEMENT_H1) },
    { label: 'Quote', icon: QuoteIcon, ...toggleElementProps(ELEMENT_BLOCKQUOTE) },
    { label: 'Code block', icon: CodeBlockIcon, ...toggleElementProps(ELEMENT_CODE_BLOCK) },
    { label: 'Bulleted list', icon: BulletedListIcon, ...toggleListProps(ELEMENT_UL) },
    { label: 'Numbered list', icon: NumberedListIcon, ...toggleListProps(ELEMENT_OL) },
    { label: 'Indent', icon: IndentIcon, onClick: () => indentListItems(editor) },
    { label: 'Unindent', icon: UnindentIcon, onClick: () => unindentListItems(editor) },
  ]

  return (
    <div className="my-auto space-y-2">
      {formattingButtons.map(({ label, icon: Icon, active, onClick, disabled = false }, index) => (
        <Tooltip key={index} content={label} placement="left">
          <button
            type="button"
            className="block btn btn-transparent p-3 aspect-square text-center disabled:opacity-50 disabled:cursor-not-allowed data-active:text-primary-500 dark:data-active:text-primary-400"
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

export default FormattingToolbar
