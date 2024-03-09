import React from 'react';
import { editorStyleClassNames } from '~/lib/editor/editorStyleClassNames';
import {
  decreaseEditorFontSize,
  increaseEditorFontSize,
  resetEditorFontSize,
  useEditorFontSize,
  useEditorFontSizeCSSValue,
} from '~/lib/editorFontSize';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { useSettings } from '~/lib/settings';
import MinusIcon from '~/components/icons/MinusIcon';
import PlusIcon from '~/components/icons/PlusIcon';
import { Tooltip } from '~/components/Tooltip';
import { EditorStyleInput } from '../EditorStyleInput';

export const AppearanceSection = () => {
  const editorFontSize = useEditorFontSize();
  const editorFontSizeCSSValue = useEditorFontSizeCSSValue();
  const [deeperDarkMode, setDeeperDarkMode] = useSettings('deeper_dark_mode');
  const [editorStyle, setEditorStyle] = useSettings('editor_style');

  return (
    <>
      <div className="space-y-2">
        <h3 className="h3 select-none">Theme</h3>

        <label className="flex gap-2 items-start">
          <input
            type="checkbox"
            className="ring-offset-plain-100 dark:ring-offset-plain-800"
            checked={deeperDarkMode}
            onChange={(event) => setDeeperDarkMode(event.target.checked)}
            aria-describedby="deeper-dark-mode-description"
          />

          <span className="select-none">Deeper dark mode</span>
        </label>

        <p
          id="deeper-dark-mode-description"
          className="text-sm text-plain-500 dark:text-plain-400"
        >
          Use pure black instead of midnight blue for the system dark mode.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="h3 select-none">Editor font size</h3>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            className="btn p-2 aspect-square btn-modal-secondary"
            onClick={decreaseEditorFontSize}
            aria-label="Decrease font size"
          >
            <MinusIcon size="1.25em" noAriaLabel />
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
            aria-label="Increase font size"
          >
            <PlusIcon size="1.25em" noAriaLabel />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="h3 select-none">Editor style</h3>

        <EditorStyleInput<false>
          value={editorStyle}
          onChange={setEditorStyle}
          syncWithOption={null}
          syncWithLink={null}
          className="xs:grid-cols-2"
        />
      </div>

      <div className="space-y-2">
        <h3 className="h3 select-none">Preview</h3>

        <p
          className={groupedClassNames({
            base: 'p-4 rounded-lg shadow-inner select-none',
            bg: 'bg-page-bg-light dark:bg-page-bg-dark',
            border: 'border dark:border-transparent',
            editorStyle: editorStyleClassNames[editorStyle],
          })}
          aria-label="Preview"
          style={{ fontSize: editorFontSizeCSSValue }}
        >
          <span className="em:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </span>
        </p>
      </div>
    </>
  );
};
