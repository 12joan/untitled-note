import { ELEMENT_BLOCKQUOTE, SoftBreakPlugin } from '~/lib/editor/plate';

export const softBreakOptions: {
  options: SoftBreakPlugin;
} = {
  options: {
    rules: [
      {
        hotkey: 'shift+enter',
      },
      {
        hotkey: 'enter',
        query: {
          allow: [ELEMENT_BLOCKQUOTE],
        },
      },
    ],
  },
};
