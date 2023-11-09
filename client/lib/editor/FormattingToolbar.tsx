import React, { ElementType } from 'react';
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_OL,
  ELEMENT_UL,
  focusEditor,
  getPluginType,
  getSelectionText,
  indentListItems,
  isMarkActive,
  isRangeAcrossBlocks,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  PlateEditor,
  someNode,
  toDOMNode,
  toggleCodeBlock,
  toggleList,
  toggleMark,
  toggleNodeType,
  unindentListItems,
} from '@udecode/plate';
import { isLinkInSelection, useToggleLink } from '~/lib/editor/links';
import { useKeyboardShortcut } from '~/lib/useKeyboardShortcut';
import BoldIcon from '~/components/icons/formatting/BoldIcon';
import BulletedListIcon from '~/components/icons/formatting/BulletedListIcon';
import CodeBlockIcon from '~/components/icons/formatting/CodeBlockIcon';
import CodeIcon from '~/components/icons/formatting/CodeIcon';
import HeadingOneIcon from '~/components/icons/formatting/HeadingOneIcon';
import IndentIcon from '~/components/icons/formatting/IndentIcon';
import ItalicIcon from '~/components/icons/formatting/ItalicIcon';
import LinkIcon from '~/components/icons/formatting/LinkIcon';
import NumberedListIcon from '~/components/icons/formatting/NumberedListIcon';
import QuoteIcon from '~/components/icons/formatting/QuoteIcon';
import StrikethroughIcon from '~/components/icons/formatting/StrikethroughIcon';
import UnindentIcon from '~/components/icons/formatting/UnindentIcon';
import { IconProps } from '~/components/icons/makeIcon';
import { Tooltip } from '~/components/Tooltip';
import { GroupedClassNames, groupedClassNames } from '../groupedClassNames';

export interface FormattingButtonProps {
  label: string;
  icon: ElementType<IconProps>;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const toggleElementProps = (editor: PlateEditor, element: string) => {
  const pluginType = getPluginType(editor, element);

  return {
    active: someNode(editor, { match: { type: pluginType } }),
    onClick: () => toggleNodeType(editor, { activeType: pluginType }),
  };
};

/**
 * After toggling a mark while the editor is blurred, the DOM selection is set
 * to an incorrect range. This workaround ensures that marks are toggled while
 * the editor is focused, and then returns the focus to its previous location.
 */
const markWorkaround = (editor: PlateEditor, callback: () => void) => {
  const priorActiveElement = document.activeElement as HTMLElement;

  if (priorActiveElement === toDOMNode(editor, editor)) {
    callback();
  } else {
    focusEditor(editor);
    callback();
    setTimeout(() => priorActiveElement?.focus(), 150);
  }
};

const toggleMarkProps = (editor: PlateEditor, mark: string) => {
  const pluginType = getPluginType(editor, mark);

  return {
    active: isMarkActive(editor, pluginType),
    onClick: () =>
      markWorkaround(editor, () => toggleMark(editor, { key: pluginType })),
  };
};

const toggleListProps = (editor: PlateEditor, listType: string) => {
  const pluginType = getPluginType(editor, listType);

  return {
    active: someNode(editor, { match: { type: pluginType } }),
    onClick: () => toggleList(editor, { type: pluginType }),
  };
};

const toggleCodeBlockProps = (editor: PlateEditor) => {
  const pluginType = getPluginType(editor, ELEMENT_CODE_BLOCK);

  return {
    active: someNode(editor, { match: { type: pluginType } }),
    onClick: () => toggleCodeBlock(editor),
  };
};

export const useInlineFormattingButtons = (
  editor: PlateEditor
): FormattingButtonProps[] => {
  const toggleLink = useToggleLink(editor);
  const linkInSelection = isLinkInSelection(editor);

  return [
    { label: 'Bold', icon: BoldIcon, ...toggleMarkProps(editor, MARK_BOLD) },
    {
      label: 'Italic',
      icon: ItalicIcon,
      ...toggleMarkProps(editor, MARK_ITALIC),
    },
    {
      label: 'Strikethrough',
      icon: StrikethroughIcon,
      ...toggleMarkProps(editor, MARK_STRIKETHROUGH),
    },
    {
      label: 'Inline code',
      icon: CodeIcon,
      ...toggleMarkProps(editor, MARK_CODE),
    },
    {
      label: linkInSelection ? 'Remove link' : 'Add link',
      active: linkInSelection,
      icon: LinkIcon,
      disabled: isRangeAcrossBlocks(editor, { at: editor.selection }),
      onClick: toggleLink,
    },
  ];
};

export const useBlockFormattingButtons = (
  editor: PlateEditor
): FormattingButtonProps[] => {
  return [
    {
      label: 'Heading',
      icon: HeadingOneIcon,
      ...toggleElementProps(editor, ELEMENT_H1),
    },
    {
      label: 'Quote',
      icon: QuoteIcon,
      ...toggleElementProps(editor, ELEMENT_BLOCKQUOTE),
    },
    {
      label: 'Code block',
      icon: CodeBlockIcon,
      ...toggleCodeBlockProps(editor),
    },
    {
      label: 'Bulleted list',
      icon: BulletedListIcon,
      ...toggleListProps(editor, ELEMENT_UL),
    },
    {
      label: 'Numbered list',
      icon: NumberedListIcon,
      ...toggleListProps(editor, ELEMENT_OL),
    },
    {
      label: 'Indent',
      icon: IndentIcon,
      onClick: () => indentListItems(editor),
    },
    {
      label: 'Unindent',
      icon: UnindentIcon,
      onClick: () => unindentListItems(editor),
    },
  ];
};

export const formattingButtonClassNames: GroupedClassNames = {
  textColor: 'data-active:text-primary-500 dark:data-active:text-primary-400',
  strokeWidth: 'data-active:stroke-[0.5] data-active:stroke-current',
};

export interface FormattingToolbarProps {
  editor: PlateEditor;
}

export const FormattingToolbar = ({ editor }: FormattingToolbarProps) => {
  const toggleLink = useToggleLink(editor);

  // Meta+K toggles link only if there is a selection;
  // otherwise it opens the search modal
  // TODO: Deprecate useKeyboardShortcut
  useKeyboardShortcut(
    () => document.querySelector('[data-slate-editor]')!,
    ['MetaShiftU', 'MetaK'],
    (event, key) => {
      const hasSelection = getSelectionText(editor).length > 0;

      if (key === 'MetaShiftU' || (key === 'MetaK' && hasSelection)) {
        event.preventDefault();
        toggleLink();
      }
    },
    [editor]
  );

  const inlineFormattingButtons = useInlineFormattingButtons(editor);
  const blockFormattingButtons = useBlockFormattingButtons(editor);

  const formattingButtons = [
    ...inlineFormattingButtons,
    ...blockFormattingButtons,
  ];

  return (
    <div className="my-auto space-y-2">
      {formattingButtons.map(
        (
          { label, icon: Icon, active = false, onClick, disabled = false },
          index
        ) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tooltip key={index} content={label} placement="left" fixed>
            <button
              type="button"
              className={groupedClassNames(
                'block btn p-3 aspect-square text-center disabled:opacity-50 disabled:cursor-not-allowed',
                formattingButtonClassNames
              )}
              data-active={active}
              disabled={disabled}
              onClick={onClick}
              onMouseDown={(event) => event.preventDefault()}
              aria-pressed={active}
              aria-label={label}
            >
              <Icon size="1.25em" noAriaLabel />
            </button>
          </Tooltip>
        )
      )}
    </div>
  );
};
