import {
  ELEMENT_LI,
  ELEMENT_LINK,
  findNode,
  getNodeEntry,
} from '@udecode/plate-headless';

const tabbableOptions = {
  options: {
    query: (editor) => {
      const inLink = findNode(editor, { match: { type: ELEMENT_LINK } });
      const inList = findNode(editor, { match: { type: ELEMENT_LI } });
      return inLink || !inList;
    },
    insertTabbableEntries: (editor) => {
      const [slateNode, path] = getNodeEntry(editor, editor.selection);

      return Array.from(document.querySelectorAll('.slate-popover button')).map(
        (domNode) => ({ domNode, slateNode, path })
      );
    },
    globalEventListener: true,
  },
};

export default tabbableOptions;
