import React, { memo, useCallback, useRef } from 'react';
import {
  Plate,
  PlateContent,
  PlateEditor,
  PlatePlugin,
  Value,
} from '@udecode/plate';
import { useAppContext } from '~/lib/appContext';
import { editorStyleClassNames } from '~/lib/editor/editorStyleClassNames';
import { FormattingToolbar } from '~/lib/editor/FormattingToolbar';
import { useLinkModalProvider } from '~/lib/editor/links';
import { SlatePlaywrightEffects } from '~/lib/editor/slate-playwright';
import {
  useEditorFontSize,
  useEditorFontSizeCSSValue,
} from '~/lib/editorFontSize';
import { groupedClassNames } from '~/lib/groupedClassNames';

export interface EditorBodyProps {
  setEditor?: (editor: PlateEditor | null) => void;
  initialValue: Value;
  plugins: PlatePlugin[];
  isReadOnly?: boolean;
  showFormattingToolbar?: boolean;
  className?: string;
  onBodyChange?: () => void;
  onSelectionChange?: () => void;
  onDoubleClick?: () => void;
}

export const EditorBody = memo(
  ({
    setEditor,
    initialValue,
    plugins,
    isReadOnly = false,
    showFormattingToolbar = true,
    className,
    onBodyChange,
    onSelectionChange,
    onDoubleClick,
  }: EditorBodyProps) => {
    const lastValue = useRef<Value>(initialValue);

    const handleChange = useCallback(
      (value: Value) => {
        onSelectionChange?.();

        // Update the body if the value has changed
        if (value === lastValue.current) return;
        onBodyChange?.();
        lastValue.current = value;
      },
      [onSelectionChange, onBodyChange]
    );

    const editorStyle = useAppContext('editorStyle');

    const relativeFontSize = useEditorFontSize() / 100;
    const cssFontSize = useEditorFontSizeCSSValue();

    const useFormattingToolbar = useAppContext('useFormattingToolbar');
    const formattingToolbar = useFormattingToolbar(<FormattingToolbar />);

    const withLinkModalProvider = useLinkModalProvider();

    return withLinkModalProvider(
      <Plate
        editorRef={setEditor}
        plugins={plugins}
        initialValue={initialValue}
        normalizeInitialValue
        readOnly={isReadOnly}
        onChange={handleChange}
      >
        <PlateContent
          className={groupedClassNames({
            className,
            spacing: 'em:space-y-3',
            textColor: 'text-black dark:text-white',
            focusRing: 'no-focus-ring',
            baseFontSize:
              'slate-string:em:text-lg/[1.555em] slate-void:em:text-lg/[inherit]',
            editorStyle: editorStyleClassNames[editorStyle],
          })}
          placeholder={isReadOnly ? undefined : 'Write something...'}
          style={{
            fontSize: cssFontSize,
            /**
             * Ensure the space below the last line scales with font size,
             * and is included in the editor region.
             */
            paddingBottom: `${1.25 * relativeFontSize}rem`,
            marginBottom: '-1.25rem',
          }}
          onDoubleClick={onDoubleClick}
        />

        {showFormattingToolbar && formattingToolbar}

        <SlatePlaywrightEffects />
      </Plate>
    );
  }
);
