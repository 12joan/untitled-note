const codeBlockOptions = {
  deserializeHtml: {
    rules: [
      {
        validNodeName: 'PRE',
      },
    ],
  },
};

export default codeBlockOptions;
