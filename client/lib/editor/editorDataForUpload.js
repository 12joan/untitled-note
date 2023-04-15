import { ELEMENT_MENTION_INPUT } from '@udecode/plate-headless';
import {
  ELEMENT_ATTACHMENT,
  getAttachmentIsUploading,
} from '~/lib/editor/attachments';
import filterDescendants from '~/lib/editor/filterDescendants';
import getPlainBody from '~/lib/editor/getPlainBody';

const excludedTypes = [ELEMENT_MENTION_INPUT];

const editorDataForUpload = (editor) => {
  const filteredEditor = filterDescendants(editor, (node) => {
    const { type } = node;

    if (excludedTypes.includes(type)) {
      return false;
    }

    if (type === ELEMENT_ATTACHMENT) {
      return !getAttachmentIsUploading(node);
    }

    return true;
  });

  return {
    body: JSON.stringify(filteredEditor.children),
    body_type: 'json/slate',
    plain_body: getPlainBody(filteredEditor),
  };
};

export default editorDataForUpload;
