import { type ForwardedRef, forwardRef } from 'react';
import UnstyledTextareaAutosize, {
  type TextareaAutosizeProps,
} from 'react-textarea-autosize';

export const TextareaAutosize = forwardRef(
  (
    { className = '', ...otherProps }: TextareaAutosizeProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => (
    <UnstyledTextareaAutosize
      ref={ref}
      className={`overflow-wrap-break-word no-focus-ring resize-none bg-transparent ${className}`}
      {...otherProps}
    />
  )
);
