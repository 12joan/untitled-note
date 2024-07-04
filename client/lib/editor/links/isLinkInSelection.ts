import { ELEMENT_LINK, PlateEditor, someNode } from '~/lib/editor/plate';

export const isLinkInSelection = (editor: PlateEditor) =>
  someNode(editor, { match: { type: ELEMENT_LINK } });
