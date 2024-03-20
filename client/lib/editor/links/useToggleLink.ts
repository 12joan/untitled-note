import {
  getSelectionText,
  insertLink,
  unwrapLink,
  useEditorRef,
} from '@udecode/plate';
import { isLinkInSelection } from './isLinkInSelection';
import { openLinkModal } from './LinkModal';

export const useToggleLink = () => {
  const editorStatic = useEditorRef();

  const toggleLink = () => {
    if (isLinkInSelection(editorStatic)) {
      unwrapLink(editorStatic);
    } else {
      openLinkModal(editorStatic, {
        initialText: getSelectionText(editorStatic),
        onConfirm: (args) => insertLink(editorStatic, args),
      });
    }
  };

  return toggleLink;
};
