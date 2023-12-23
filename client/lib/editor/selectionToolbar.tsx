import React, { MouseEvent } from 'react';
import {
  createPluginFactory,
  getBoundingClientRect,
  isRangeInSameBlock,
  isSelectionExpanded,
  useEditorReadOnly,
  useEditorRef,
  useEditorSelector,
} from '@udecode/plate';
import { useFocused } from 'slate-react';
import { FloatingToolbar, FloatingToolbarItem } from './FloatingToolbar';
import {
  formattingButtonClassNames,
  useInlineFormattingButtons,
} from './FormattingToolbar';

const SelectionToolbar = () => {
  const editorStatic = useEditorRef();

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
        getReferenceClientRect: () =>
          getBoundingClientRect(editorStatic) ?? new DOMRect(),
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
