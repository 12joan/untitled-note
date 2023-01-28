import {
  ELEMENT_BLOCKQUOTE,
} from '@udecode/plate-headless'

const softBreakOptions = {
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
}

export default softBreakOptions
