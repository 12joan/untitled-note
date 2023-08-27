import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  Ref,
  useRef,
} from 'react';
import { useEditorFontSizeCSSValue } from '~/lib/editorFontSize';
import { TextareaAutosize } from '~/components/TextareaAutosize';

export interface EditorTitleProps {
  initialTitle: string;
  onChange: (title: string) => void;
  onEnter: () => void;
}

export const EditorTitle = forwardRef(
  (
    { initialTitle, onChange, onEnter }: EditorTitleProps,
    ref: Ref<HTMLTextAreaElement>
  ) => {
    const fontSize = useEditorFontSizeCSSValue();
    const isComposingRef = useRef(false);

    const setIsComposing = (isComposing: boolean) => {
      isComposingRef.current = isComposing;
    };

    return (
      <div className="contents" style={{ fontSize }}>
        <TextareaAutosize
          ref={ref}
          className="min-w-0 grow h1 em:text-2xl sm:em:text-3xl text-black dark:text-white placeholder:truncate"
          style={{
            lineHeight: '1.2em',
          }}
          defaultValue={initialTitle}
          placeholder="Untitled document"
          ignorePlaceholder
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
            onChange(event.target.value);
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          onKeyDown={(event: KeyboardEvent) => {
            if (event.key === 'Enter' && !isComposingRef.current) {
              event.preventDefault();
              onEnter();
            }
          }}
        />
      </div>
    );
  }
);
