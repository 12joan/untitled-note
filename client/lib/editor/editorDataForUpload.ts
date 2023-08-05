import { ELEMENT_MENTION_INPUT, PlateEditor } from '@udecode/plate';
import {
  ELEMENT_ATTACHMENT,
  getAttachmentIsUploading,
} from '~/lib/editor/attachments';
import { filterDescendants } from '~/lib/editor/filterDescendants';
import { getPlainBody } from '~/lib/editor/getPlainBody';

const excludedTypes = [ELEMENT_MENTION_INPUT];

export const getFilteredEditor = (editor: PlateEditor) =>
  filterDescendants(editor, (node) => {
    const { type } = node;

    if (typeof type === 'string') {
      if (excludedTypes.includes(type)) {
        return false;
      }

      if (type === ELEMENT_ATTACHMENT) {
        return !getAttachmentIsUploading(node as any);
      }
    }

    return true;
  });

export const editorDataForUpload = (editor: PlateEditor) => {
  const filteredEditor = getFilteredEditor(editor);

  return {
    body: JSON.stringify(filteredEditor.children),
    body_type: 'json/slate',
    plain_body: getPlainBody(filteredEditor),
  };
};
