import React, { MouseEvent } from 'react';
import {
  createPluginFactory,
  isRangeInSameBlock,
  isSelectionExpanded,
  useEditorReadOnly,
  useEditorSelector,
} from '@udecode/plate';
import { useFocused } from 'slate-react';
import { FloatingToolbar, FloatingToolbarItem } from './FloatingToolbar';
import {
  formattingButtonClassNames,
  useInlineFormattingButtons,
} from './FormattingToolbar';

const SelectionToolbar = () => {
  const open: boolean = useEditorSelector(
    (editor) =>
      isSelectionExpanded(editor) && (isRangeInSameBlock(editor) ?? false),
    []
  );

  /**
   * If open is true, we want to re-render every time the selection changes so
   * that we keep the toolbar position up to date.
   */
  useEditorSelector((editor) => open && editor.selection, [open]);

  // Re-render when the editor regains focus
  useFocused();

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
  const formattingButtons = useInlineFormattingButtons().filter(
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
