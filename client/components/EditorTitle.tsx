import React, {
  ChangeEvent,
  forwardRef,
  KeyboardEvent,
  Ref,
  useRef,
} from 'react';
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
    const isComposingRef = useRef(false);

    const setIsComposing = (isComposing: boolean) => {
      isComposingRef.current = isComposing;
    };

    return (
      <TextareaAutosize
        ref={ref}
        className="min-w-0 grow h1 text-black dark:text-white placeholder:truncate"
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
    );
  }
);
