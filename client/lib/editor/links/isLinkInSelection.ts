import { ELEMENT_LINK, PlateEditor, someNode } from '@udecode/plate';

export const isLinkInSelection = (editor: PlateEditor) =>
  someNode(editor, { match: { type: ELEMENT_LINK } });
