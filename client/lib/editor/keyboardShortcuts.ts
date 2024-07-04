import { LocalKeyboardShortcutCommandId } from '~/lib/commands';
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_OL,
  ELEMENT_UL,
  getPluginType,
  getSelectionText,
  isEditorFocused,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  PlateEditor,
  toggleCodeBlock,
  toggleList,
  toggleMark,
  toggleNodeType,
  useEditorRef,
} from '~/lib/editor/plate';
import { useLocalKeyboardShortcut } from '../useLocalKeyboardShortcut';
import { useToggleLink } from './links/useToggleLink';

const toggleMarkHandler = (key: string) => (editor: PlateEditor) =>
  toggleMark(editor, { key: getPluginType(editor, key) });

const toggleElementHandler = (key: string) => (editor: PlateEditor) =>
  toggleNodeType(editor, { activeType: getPluginType(editor, key) });

const toggleListHandler = (key: string) => (editor: PlateEditor) =>
  toggleList(editor, { type: getPluginType(editor, key) });

const toggleCodeBlockHandler = toggleCodeBlock;

const editorCommands: {
  [Id in LocalKeyboardShortcutCommandId]?: (editor: PlateEditor) => void;
} = {
  bold: toggleMarkHandler(MARK_BOLD),
  italic: toggleMarkHandler(MARK_ITALIC),
  strikethrough: toggleMarkHandler(MARK_STRIKETHROUGH),
  code: toggleMarkHandler(MARK_CODE),
  heading: toggleElementHandler(ELEMENT_H1),
  blockquote: toggleElementHandler(ELEMENT_BLOCKQUOTE),
  bulletedList: toggleListHandler(ELEMENT_UL),
  numberedList: toggleListHandler(ELEMENT_OL),
  codeBlock: toggleCodeBlockHandler,
};

export const EditorKeyboardShortcuts = () => {
  const editorStatic = useEditorRef();
  const getFocused = () => isEditorFocused(editorStatic);

  Object.entries(editorCommands).forEach(([commandId, callback]) => {
    useLocalKeyboardShortcut(
      document,
      commandId as LocalKeyboardShortcutCommandId,
      (event) => {
        if (!getFocused()) return;
        event.preventDefault();
        callback(editorStatic);
      },
      true // Use capture to take precedence over other shortcuts
    );
  });

  const toggleLink = useToggleLink();

  useLocalKeyboardShortcut(
    document,
    'alwaysLink',
    (event) => {
      if (!getFocused()) return;
      event.preventDefault();
      toggleLink();
    },
    true // Use capture to take precedence over other shortcuts
  );

  useLocalKeyboardShortcut(
    document,
    'linkSelection',
    (event) => {
      const hasSelection = getSelectionText(editorStatic).length > 0;
      if (!getFocused() || !hasSelection) return;
      event.preventDefault();
      toggleLink();
    },
    true // Use capture to take precedence over other shortcuts
  );

  return null;
};
