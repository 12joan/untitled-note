import React from 'react';
import { useLocalProject } from '~/lib/useLocalProject';
import { useOverrideable } from '~/lib/useOverrideable';
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled';
import { EditorStyleInput } from '~/components/EditorStyleInput';

export const EditProjectEditorStyle = () => {
  const [localProject, updateProject] = useLocalProject();
  const [editorStyle, setEditorStyle] = useOverrideable(
    localProject.editor_style
  );

  useWaitUntilSettled(editorStyle, () => {
    updateProject({ editor_style: editorStyle });
  });

  return (
    <div className="space-y-2">
      <h2 className="font-medium select-none">Editor style</h2>

      <EditorStyleInput
        value={editorStyle}
        onChange={setEditorStyle}
        syncWithOption="settings"
      />
    </div>
  );
};
