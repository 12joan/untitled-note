import React, { MouseEvent } from 'react';
import { isSelectionExpanded, usePlateEditorState } from '@udecode/plate';
import { FloatingToolbar, FloatingToolbarItem } from './FloatingToolbar';
import {
  formattingButtonClassNames,
  useInlineFormattingButtons,
} from './FormattingToolbar';

export const SelectionToolbar = () => {
  const editor = usePlateEditorState();
  const open = isSelectionExpanded(editor);

  const formattingButtons = useInlineFormattingButtons(editor).filter(
    ({ disabled }) => !disabled
  );

  return (
    <FloatingToolbar
      open={open}
      items={
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
      }
      tippyProps={{
        getReferenceClientRect: () => {
          const selection = window.getSelection()!;
          const range = selection.getRangeAt(0);
          return range.getBoundingClientRect();
        },
      }}
    />
  );
};
