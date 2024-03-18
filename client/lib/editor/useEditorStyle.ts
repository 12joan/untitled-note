import { useAppContext } from '~/lib/appContext';
import { useSettings } from '~/lib/settings';
import { EditorStyle, LocalDocument } from '../types';

export const useEditorStyle = (doc: LocalDocument): EditorStyle => {
  const [settingsEditorStyle] = useSettings('editor_style');
  const { editor_style: projectEditorStyle } = useAppContext('project');
  const { editor_style: documentEditorStyle } = doc;
  return documentEditorStyle ?? projectEditorStyle ?? settingsEditorStyle;
};
