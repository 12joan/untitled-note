import pretty from 'pretty';
import { TDescendant, TElement, TText } from '~/lib/editor/plate';

export type GetHTMLForExportOptions = {
  title: string | null;
};

const plateElementToDomNode = (
  node: TElement,
  { title }: GetHTMLForExportOptions
): HTMLElement | null => {
  switch (node.type) {
    case 'p':
    case 'blockquote':
    case 'ul':
    case 'ol':
    case 'li':
      return document.createElement(node.type);

    case 'h1':
      return document.createElement(title === null ? 'h1' : 'h2');

    case 'a':
      const anchor = document.createElement('a');
      anchor.href = node.url as string;
      return anchor;

    case 'code_block':
      return document.createElement('pre');

    // FIXME: We don't currently have a static URL for attachments
    case 'attachment':
      const placeholder = document.createElement('p');
      placeholder.innerText = `<${node.filename}>`;
      return placeholder;

    case 'mention':
      const mention = document.createElement('span');
      mention.innerText = node.fallbackText as string;
      return mention;

    case 'lic':
    case 'code_line':
    case 'mention_input':
      return null;

    default:
      // eslint-disable-next-line no-console
      console.warn('Unknown element type', node.type);
      return null;
  }
};

const wrappersForMarkType: Record<string, string | undefined> = {
  bold: 'strong',
  italic: 'em',
  strikethrough: 'del',
  code: 'code',
};

const plateTextToDomNode = (node: TText): HTMLElement | Text => {
  const textNode = document.createTextNode(node.text);

  return Object.entries(node).reduce(
    (domNode: HTMLElement | Text, [key, value]) => {
      if (key === 'text' || !value) {
        return domNode;
      }

      const wrapperType = wrappersForMarkType[key];

      if (!wrapperType) {
        // eslint-disable-next-line no-console
        console.warn('Unknown mark type', key);
        return domNode;
      }

      const wrapper = document.createElement(wrapperType);
      wrapper.appendChild(domNode);
      return wrapper;
    },
    textNode
  );
};

const getNodeHtmlForExport = (
  node: TDescendant,
  options: GetHTMLForExportOptions
): string => {
  if ('text' in node) {
    const container = document.createElement('span');
    container.appendChild(plateTextToDomNode(node as TText));
    return container.innerHTML.replace(/\n/g, '<br>');
  }

  const childrenHtml = node.children
    .map((child) => getNodeHtmlForExport(child, options))
    .join('');

  const domNode = plateElementToDomNode(node, options);
  if (!domNode) return childrenHtml;

  domNode.innerHTML += childrenHtml;

  return domNode.outerHTML;
};

export const getHtmlForExport = (
  children: TDescendant[],
  options: GetHTMLForExportOptions
): string => {
  let html = children
    .map((child) => getNodeHtmlForExport(child, options))
    .join('');

  if (options.title !== null) {
    const titleElement = document.createElement('h1');
    titleElement.innerText = options.title;
    html = titleElement.outerHTML + html;
  }

  return pretty(html);
};
