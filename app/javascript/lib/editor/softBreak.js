import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
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
          allow: [ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK],
        },
      },
    ],
  },
}

export default softBreakOptions
