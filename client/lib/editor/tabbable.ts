import {
  ELEMENT_LI,
  ELEMENT_LINK,
  findNode,
  getNodeEntry,
  PlateEditor,
  TabbableEntry,
  TabbablePlugin,
} from '@udecode/plate-headless';

export const tabbableOptions: {
  options: TabbablePlugin;
} = {
  options: {
    query: (editor: PlateEditor) => {
      const inLink = findNode(editor, { match: { type: ELEMENT_LINK } });
      const inList = findNode(editor, { match: { type: ELEMENT_LI } });
      return Boolean(inLink || !inList);
    },
    insertTabbableEntries: (editor: PlateEditor) => {
      const { selection } = editor;
      const nodeEntry = selection && getNodeEntry(editor, selection);

      if (!nodeEntry) return [];

      const [slateNode, path] = nodeEntry;

      return Array.from(document.querySelectorAll('.slate-popover button')).map(
        (domNode) => ({ domNode, slateNode, path } as TabbableEntry)
      );
    },
    globalEventListener: true,
  },
};
