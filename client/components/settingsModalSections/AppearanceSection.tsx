import React from 'react';
import {
  decreaseEditorFontSize,
  increaseEditorFontSize,
  resetEditorFontSize,
  useEditorFontSize,
  useEditorFontSizeCSSValue,
} from '~/lib/editorFontSize';
import MinusIcon from '~/components/icons/MinusIcon';
import PlusIcon from '~/components/icons/PlusIcon';
import { Tooltip } from '~/components/Tooltip';

export const AppearanceSection = () => {
  const editorFontSize = useEditorFontSize();
  const editorFontSizeCSSValue = useEditorFontSizeCSSValue();

  return (
    <>
      <div className="space-y-2">
        <h3 className="h3 select-none">Preview</h3>
        <p
          className="bg-page-bg-light dark:bg-page-bg-dark rounded-lg p-4 shadow-inner border dark:border-transparent truncate select-none min-h-[6.25rem] flex items-center"
          aria-label="Preview"
          style={{ fontSize: editorFontSizeCSSValue }}
        >
          <span className="em:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="h3 select-none">Font size</h3>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="btn p-2 aspect-square btn-modal-secondary"
            onClick={decreaseEditorFontSize}
          >
            <MinusIcon size="1.25em" ariaLabel="Decrease font size" />
          </button>

          <Tooltip content="Reset font size" placement="bottom">
            <button
              type="button"
              className="btn btn-link-subtle min-w-[4.5ch]"
              aria-label="Reset font size"
              onClick={resetEditorFontSize}
            >
              {editorFontSize}%
            </button>
          </Tooltip>

          <button
            type="button"
            className="btn p-2 aspect-square btn-modal-secondary"
            onClick={increaseEditorFontSize}
          >
            <PlusIcon size="1.25em" ariaLabel="Increase font size" />
          </button>
        </div>
      </div>
    </>
  );
};
