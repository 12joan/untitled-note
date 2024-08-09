import { EditorStyle } from '~/lib/types';

export const editorStyleClassNames: Record<EditorStyle, string> = {
  casual: 'slate-string:em:leading-[1.555em] em:space-y-3',
  literary: 'font-serif text-justify style-literary em:space-y-3',
  mono: 'font-mono style-mono',
};
