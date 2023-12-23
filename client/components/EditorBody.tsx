import React, { memo, useCallback, useRef } from 'react';
import { Plate, PlateContent, PlateEditor, Value } from '@udecode/plate';
import { useAppContext } from '~/lib/appContext';
import { FormattingToolbar } from '~/lib/editor/FormattingToolbar';
import { useLinkModalProvider } from '~/lib/editor/links';
import { usePlugins } from '~/lib/editor/plugins';
import { saveSelection } from '~/lib/editor/restoreSelection';
import { SlatePlaywrightEffects } from '~/lib/editor/slate-playwright';
import { useInitialValue } from '~/lib/editor/useInitialValue';
import { useEditorFontSizeCSSValue } from '~/lib/editorFontSize';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { Document } from '~/lib/types';

export interface EditorBodyProps {
  editor: PlateEditor | null;
  setEditor: (editor: PlateEditor | null) => void;
  initialDocument: Document;
  isReadOnly: boolean;
  onBodyChange: () => void;
  onDoubleClick: () => void;
}

export const EditorBody = memo(
  ({
    editor,
    setEditor,
    initialDocument,
    isReadOnly,
    onBodyChange,
    onDoubleClick,
  }: EditorBodyProps) => {
    const documentId = initialDocument.id;

    const plugins = usePlugins();

    const initialValue = useInitialValue({
      initialDocument,
      plugins,
    });

    const lastValue = useRef<Value>(initialValue);

    const handleChange = useCallback(
      (value: Value) => {
        if (editor) saveSelection(documentId, editor);

        // Update the body if the value has changed
        if (value === lastValue.current) return;
        onBodyChange();
        lastValue.current = value;
      },
      [documentId, editor, onBodyChange]
    );

    const fontSize = useEditorFontSizeCSSValue();

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
            sizing: 'grow max-w-none children:lg:narrow',
            spacing: 'em:mt-3 em:space-y-3',
            textColor: 'text-black dark:text-white',
            focusRing: 'no-focus-ring',
            baseFontSize:
              'slate-void:em:text-lg slate-string:em:text-lg/[1.555em]',
          })}
          placeholder="Write something..."
          style={{ fontSize }}
          onDoubleClick={onDoubleClick}
        />

        {formattingToolbar}

        <SlatePlaywrightEffects />
      </Plate>
    );
  }
);
