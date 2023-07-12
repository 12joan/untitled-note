import { DeserializeHtml } from '@udecode/plate';

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
