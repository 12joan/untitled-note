import { Path } from 'slate';
import {
  useFocused as useSlateFocused,
  useSelected as useSlateSelected,
} from 'slate-react';
import {
  ELEMENT_PARAGRAPH,
  getEditorString,
  getNode,
  PlateEditor,
  removeNodes,
  someNode,
  TNode,
} from '~/lib/editor/plate';
import { ELEMENT_ATTACHMENT } from './constants';

export const matchAttachmentNode = (id: number) => (node: TNode) =>
  node.type === ELEMENT_ATTACHMENT && node.s3FileId === id;

export const attachmentNodeExists = (editor: PlateEditor, id: number) =>
  someNode(editor, {
    at: [],
    match: matchAttachmentNode(id),
  });

export const removeAllAttachmentNodes = (editor: PlateEditor, id: number) =>
  removeNodes(editor, {
    at: [],
    match: matchAttachmentNode(id),
  });

export const nodeAtPathIsEmptyParagraph = (editor: PlateEditor, path: Path) => {
  const node = getNode(editor, path);

  return (
    node &&
    node.type === ELEMENT_PARAGRAPH &&
    getEditorString(editor, path).trim() === ''
  );
};

export const useSelected = () => {
  const isSelected = useSlateSelected();
  const isFocused = useSlateFocused();
  return isSelected && isFocused;
};
