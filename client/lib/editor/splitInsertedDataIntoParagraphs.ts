import {
  createPluginFactory,
  ELEMENT_PARAGRAPH,
  isText,
  KEY_DESERIALIZE_HTML,
  TDescendant,
  TElement,
} from '@udecode/plate-headless';

const splitFragmentIntoParagraphs = (fragment: TDescendant[]) => {
  const newFragment = fragment.flatMap((node) => {
    const nodeIsText = isText(node);

    // Only split text and paragraph nodes
    if (!nodeIsText && node.type !== ELEMENT_PARAGRAPH) {
      return node;
    }

    const paragraphs: TElement[] = [];

    const newParagraph = () => {
      paragraphs.push({ type: ELEMENT_PARAGRAPH, children: [] });
    };

    const appendToLastParagraph = (child: TDescendant) => {
      paragraphs[paragraphs.length - 1].children.push(child);
    };

    // Always return at least one paragraph
    newParagraph();

    const children = nodeIsText ? [node] : node.children;

    children.forEach((child) => {
      // Only split text nodes
      if (!isText(child)) {
        appendToLastParagraph(child);
        return;
      }

      const { text, ...textNodeProps } = child;

      // For every pair of newlines, create a new paragraph
      const [firstParagraph, ...restParagraphs] = text
        .split('\n\n')
        .map((text) => text.replace(/^\n/, ''));

      appendToLastParagraph({ text: firstParagraph, ...textNodeProps });

      restParagraphs.forEach((text) => {
        newParagraph();
        appendToLastParagraph({ text, ...textNodeProps });
      });
    });

    return paragraphs;
  });

  return newFragment;
};

export const createSplitInsertedDataIntoParagraphsPlugin = createPluginFactory({
  key: 'splitInsertedDataIntoParagraphs',
  inject: {
    pluginsByKey: {
      [KEY_DESERIALIZE_HTML]: {
        editor: {
          insertData: {
            format: 'text/html',
            transformFragment: splitFragmentIntoParagraphs,
          },
        },
      },
    },
  },
});
