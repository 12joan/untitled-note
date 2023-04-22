import { DeserializeHtml } from '@udecode/plate-headless';

export const codeBlockOptions: {
  deserializeHtml: DeserializeHtml;
} = {
  deserializeHtml: {
    rules: [
      {
        validNodeName: 'PRE',
      },
    ],
  },
};
