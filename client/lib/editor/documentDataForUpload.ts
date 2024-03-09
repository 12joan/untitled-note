import {
  ELEMENT_MENTION_INPUT,
  isElement,
  PlateEditor,
  TDescendant,
} from '@udecode/plate';
import {
  ELEMENT_ATTACHMENT,
  getAttachmentIsUploading,
} from '~/lib/editor/attachments';
import { filterDescendants } from '~/lib/editor/filterDescendants';
import { getPlainBody } from '~/lib/editor/getPlainBody';
import { AttachmentElement } from './attachments/types';

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

export const documentDataForUpload = (editor: PlateEditor) => {
  const filteredChildren = getFilteredChildren(editor.children);

  return {
    body: JSON.stringify(filteredChildren),
    body_type: 'json/slate',
    plain_body: getPlainBody({ type: '', children: filteredChildren }),
  };
};
