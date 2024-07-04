import React, { MouseEvent } from 'react';
import { useFocused } from 'slate-react';
import {
  createPluginFactory,
  getBoundingClientRect,
  isRangeInSameBlock,
  isSelectionExpanded,
  useEditorReadOnly,
  useEditorRef,
  useEditorSelector,
} from '~/lib/editor/plate';
import { FloatingToolbar, FloatingToolbarItem } from './FloatingToolbar';
import {
  formattingButtonClassNames,
  useInlineFormattingButtons,
} from './FormattingToolbar';

const activeElementIsInToolbar = () =>
  document.activeElement?.closest('[data-selection-toolbar]') !== null;

const SelectionToolbar = () => {
  const editorStatic = useEditorRef();
  const focused = useFocused();

  const open: boolean = useEditorSelector(
    (editor) => {
      if (!focused && !activeElementIsInToolbar()) return false;
      if (!isSelectionExpanded(editor)) return false;
      return isRangeInSameBlock(editor) ?? false;
    },
    [focused]
  );

  /**
   * If open is true, we want to re-render every time the selection changes so
   * that we keep the toolbar position up to date.
   */
  useEditorSelector((editor) => open && editor.selection, [open]);

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
          'data-selection-toolbar': true,
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
