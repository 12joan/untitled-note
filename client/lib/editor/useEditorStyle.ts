import {useAppContext} from "../appContext";
import {useSettings} from "../settings";
import {LocalDocument, EditorStyle} from "../types";

export const useEditorStyle = (doc: LocalDocument): EditorStyle => {
  const [{ editorStyle : settingsEditorStyle }] = useSettings();
  const { editor_style : projectEditorStyle } = useAppContext('project');
  const { editor_style : documentEditorStyle } = doc;
  return documentEditorStyle ?? projectEditorStyle ?? settingsEditorStyle;
};
