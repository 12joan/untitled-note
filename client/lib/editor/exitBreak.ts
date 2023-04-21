import {
  KEYS_HEADING,
  ExitBreakPlugin,
} from '@udecode/plate-headless';

export const exitBreakOptions: {
  options: ExitBreakPlugin;
} = {
  options: {
    rules: [
      {
        hotkey: 'mod+enter',
      },
      {
        hotkey: 'mod+shift+enter',
        before: true,
      },
      {
        hotkey: 'enter',
        query: {
          start: true,
          end: true,
          allow: KEYS_HEADING,
        },
      },
    ],
  },
};
