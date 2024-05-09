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
  isHotkey,
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
  useEditorMounted,
  useEditorReadOnly,
  useEditorRef,
  useEditorSelector,
} from '@udecode/plate';
import { isLinkInSelection } from '~/lib/editor/links/isLinkInSelection';
import { GroupedClassNames, groupedClassNames } from '~/lib/groupedClassNames';
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
import { useToggleLink } from './links/useToggleLink';
import { useEditorEvent } from './imperativeEvents';

const usePluginType = (key: string) =>
  useEditorSelector((editor) => getPluginType(editor, key), [key]);

const useSomeNode = (pluginType: string) =>
  useEditorSelector(
    (editor) => someNode(editor, { match: { type: pluginType } }),
    [pluginType]
  );

const useMarkActive = (pluginType: string) =>
  useEditorSelector((editor) => isMarkActive(editor, pluginType), [pluginType]);

const useToggleElementProps = (element: string) => {
  const pluginType = usePluginType(element);
  const active = useSomeNode(pluginType);
  const editorStatic = useEditorRef();
  const onClick = () =>
    toggleNodeType(editorStatic, { activeType: pluginType });
  return { active, onClick };
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

const useToggleMarkProps = (mark: string) => {
  const pluginType = usePluginType(mark);
  const active = useMarkActive(pluginType);
  const editorStatic = useEditorRef();
  const onClick = () =>
    markWorkaround(editorStatic, () =>
      toggleMark(editorStatic, { key: pluginType })
    );
  return { active, onClick };
};

const useToggleListProps = (listType: string) => {
  const pluginType = usePluginType(listType);
  const active = useSomeNode(pluginType);
  const editorStatic = useEditorRef();
  const onClick = () => toggleList(editorStatic, { type: pluginType });
  return { active, onClick };
};

const useToggleCodeBlockProps = () => {
  const pluginType = usePluginType(ELEMENT_CODE_BLOCK);
  const active = useSomeNode(pluginType);
  const editorStatic = useEditorRef();
  const onClick = () => toggleCodeBlock(editorStatic);
  return { active, onClick };
};

export const useInlineFormattingButtons = (): FormattingButtonProps[] => {
  const toggleLink = useToggleLink();
  const linkInSelection = useEditorSelector(isLinkInSelection, []);
  const rangeAccrossBlocks = useEditorSelector(
    (editor) => isRangeAcrossBlocks(editor),
    []
  );

  return [
    { label: 'Bold', icon: BoldIcon, ...useToggleMarkProps(MARK_BOLD) },
    {
      label: 'Italic',
      icon: ItalicIcon,
      ...useToggleMarkProps(MARK_ITALIC),
    },
    {
      label: 'Strikethrough',
      icon: StrikethroughIcon,
      ...useToggleMarkProps(MARK_STRIKETHROUGH),
    },
    {
      label: 'Inline code',
      icon: CodeIcon,
      ...useToggleMarkProps(MARK_CODE),
    },
    {
      label: linkInSelection ? 'Remove link' : 'Add link',
      active: linkInSelection,
      icon: LinkIcon,
      disabled: rangeAccrossBlocks,
      onClick: toggleLink,
    },
  ];
};

export const useBlockFormattingButtons = (): FormattingButtonProps[] => {
  const editorStatic = useEditorRef();

  return [
    {
      label: 'Heading',
      icon: HeadingOneIcon,
      ...useToggleElementProps(ELEMENT_H1),
    },
    {
      label: 'Quote',
      icon: QuoteIcon,
      ...useToggleElementProps(ELEMENT_BLOCKQUOTE),
    },
    {
      label: 'Code block',
      icon: CodeBlockIcon,
      ...useToggleCodeBlockProps(),
    },
    {
      label: 'Bulleted list',
      icon: BulletedListIcon,
      ...useToggleListProps(ELEMENT_UL),
    },
    {
      label: 'Numbered list',
      icon: NumberedListIcon,
      ...useToggleListProps(ELEMENT_OL),
    },
    {
      label: 'Indent',
      icon: IndentIcon,
      onClick: () => indentListItems(editorStatic),
    },
    {
      label: 'Unindent',
      icon: UnindentIcon,
      onClick: () => unindentListItems(editorStatic),
    },
  ];
};

export const formattingButtonClassNames: GroupedClassNames = {
  textColor: 'data-active:text-primary-500 dark:data-active:text-primary-400',
  strokeWidth: 'data-active:stroke-[0.5] data-active:stroke-current',
};

export const FormattingToolbar = () => {
  const editorStatic = useEditorRef();
  const toggleLink = useToggleLink();

  useEditorEvent(
    'keyDown',
    (event) => {
      if (event.defaultPrevented) return;

      const isMetaShiftU = isHotkey('mod+shift+u', event);
      const isMetaK = isHotkey('mod+k', event);

      if (isMetaShiftU || isMetaK) {
        const hasSelection = getSelectionText(editorStatic).length > 0;

        if (isMetaShiftU || (isMetaK && hasSelection)) {
          event.preventDefault();
          toggleLink();
        }
      }
    },
    []
  );

  const inlineFormattingButtons = useInlineFormattingButtons();
  const blockFormattingButtons = useBlockFormattingButtons();

  const formattingButtons = [
    ...inlineFormattingButtons,
    ...blockFormattingButtons,
  ];

  return (
    <>
      {formattingButtons.map((props, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <FormattingButton key={index} {...props} />
      ))}
    </>
  );
};

interface FormattingButtonProps {
  label: string;
  icon: ElementType<IconProps>;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const FormattingButton = ({
  label,
  icon: Icon,
  active: propActive = false,
  disabled: propDisabled = false,
  onClick,
}: FormattingButtonProps) => {
  const isReadOnly = useEditorReadOnly();
  const isMounted = useEditorMounted();
  const hasSelection = useEditorSelector((editor) => !!editor.selection, []);

  const active = !isReadOnly && hasSelection && propActive;
  const disabled = !isMounted || isReadOnly || propDisabled;

  return (
    <Tooltip content={label} placement="left" fixed>
      <button
        type="button"
        className={groupedClassNames(
          'block btn p-3 aspect-square text-center disabled:opacity-50 disabled:cursor-not-allowed',
          formattingButtonClassNames
        )}
        data-active={active}
        disabled={isReadOnly || disabled}
        onClick={onClick}
        onMouseDown={(event) => event.preventDefault()}
        aria-pressed={active}
        aria-label={label}
      >
        <Icon size="1.25em" noAriaLabel />
      </button>
    </Tooltip>
  );
};
