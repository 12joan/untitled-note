import { ELEMENT_LINK, type PlateEditor, someNode } from '~/lib/editor/plate';

export const isLinkInSelection = (editor: PlateEditor) =>
  someNode(editor, { match: { type: ELEMENT_LINK } });
