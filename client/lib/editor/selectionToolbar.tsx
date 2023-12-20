import React, { MouseEvent } from 'react';
import {
  createPluginFactory,
  isRangeInSameBlock,
  isSelectionExpanded,
  useEditorReadOnly,
  useEditorState,
} from '@udecode/plate';
import { useSlateSelector } from 'slate-react';
import { FloatingToolbar, FloatingToolbarItem } from './FloatingToolbar';
import {
  formattingButtonClassNames,
  useInlineFormattingButtons,
} from './FormattingToolbar';

const SelectionToolbar = () => {
  const open = useSlateSelector(
    (editor) =>
      isSelectionExpanded(editor as any) &&
      (isRangeInSameBlock(editor as any) ?? false),
    /**
     * If open is true, we want to rerender every time the selection changes so
     * that we keep the toolbar position up to date. If open is false, we only
     * want to rerender when it becomes true.
     */
    (prevOpen, newOpen) => !prevOpen && !newOpen
  );

  const readOnly = useEditorReadOnly();
  if (readOnly) return null;

  return (
    <FloatingToolbar
      open={open}
      items={open && <SelectionToolbarInner />}
      tippyProps={{
        getReferenceClientRect: () => {
          const selection = window.getSelection()!;
          const range = selection.getRangeAt(0);
          return range.getBoundingClientRect();
        },
      }}
      containerProps={
        {
          'data-testid': 'selection-toolbar',
        } as any
      }
    />
  );
};

const SelectionToolbarInner = () => {
  const editor = useEditorState();

  const formattingButtons = useInlineFormattingButtons(editor).filter(
    ({ disabled }) => !disabled
  );

  return (
    <>
      {formattingButtons.map(({ label, icon, active, onClick }) => (
        <FloatingToolbarItem
          key={label}
          icon={icon}
          label={label}
          className={formattingButtonClassNames}
          data-active={active}
          onClick={onClick}
          onMouseDown={(event: MouseEvent) => event.preventDefault()}
        />
      ))}
    </>
  );
};

export const createSelectionToolbarPlugin = createPluginFactory({
  key: 'selectionToolbar',
  renderAfterEditable: SelectionToolbar,
});
