import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  Ref,
  TextareaHTMLAttributes,
  useRef,
} from 'react';
import { useAppContext } from '~/lib/appContext';
import { useEditorFontSizeCSSValue } from '~/lib/editorFontSize';
import { groupedClassNames } from '~/lib/groupedClassNames';
import { TextareaAutosize } from '~/components/TextareaAutosize';

export interface EditorTitleProps {
  initialTitle: string;
  textareaProps?: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'>;
  onChange: (title: string) => void;
  onEnter: () => void;
}

export const EditorTitle = forwardRef(
  (
    { initialTitle, textareaProps = {}, onChange, onEnter }: EditorTitleProps,
    ref: Ref<HTMLTextAreaElement>
  ) => {
    const editorStyle = useAppContext('editorStyle');

    const fontSize = useEditorFontSizeCSSValue();
    const isComposingRef = useRef(false);

    const setIsComposing = (isComposing: boolean) => {
      isComposingRef.current = isComposing;
    };

    return (
      <div className="contents" style={{ fontSize }}>
        <TextareaAutosize
          ref={ref}
          className={groupedClassNames({
            sizing: 'min-w-0 grow',
            textStyle:
              'h1 em:text-2xl sm:em:text-3xl text-black dark:text-white',
            placeholder: 'placeholder:truncate',
            editorStyle: {
              casual: '',
              literary: 'font-serif',
              mono: 'font-mono',
            }[editorStyle],
          })}
          style={{
            lineHeight: '1.2em',
          }}
          defaultValue={initialTitle}
          placeholder="Untitled document"
          aria-label="Document title"
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
          {...textareaProps}
        />
      </div>
    );
  }
);
