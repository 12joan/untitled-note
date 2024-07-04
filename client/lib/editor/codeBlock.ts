import { DeserializeHtml } from '~/lib/editor/plate';

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
