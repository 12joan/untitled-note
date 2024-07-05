import {
  ELEMENT_ATTACHMENT,
  getAttachmentIsUploading,
} from '~/lib/editor/attachments';
import { filterDescendants } from '~/lib/editor/filterDescendants';
import { isElement, PlateEditor, TDescendant } from '~/lib/editor/plate';
import { AttachmentElement } from './attachments/types';
import { ELEMENT_MENTION_INPUT } from './mentions';

const excludedTypes = [ELEMENT_MENTION_INPUT];

export const getFilteredChildren = (children: TDescendant[]) =>
  filterDescendants(children, (node) => {
    if (isElement(node)) {
      if (excludedTypes.includes(node.type)) {
        return false;
      }

      if (node.type === ELEMENT_ATTACHMENT) {
        return !getAttachmentIsUploading(node as AttachmentElement);
      }
    }

    return true;
  });

export const documentDataForUpload = (editor: PlateEditor) => ({
  body: JSON.stringify(getFilteredChildren(editor.children)),
  body_type: 'json/slate',
});
