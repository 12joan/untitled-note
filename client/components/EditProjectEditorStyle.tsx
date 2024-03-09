import React from 'react';
import { useAppContext } from '~/lib/appContext';
import { useLocalProject } from '~/lib/useLocalProject';
import { useOverrideable } from '~/lib/useOverrideable';
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled';
import { EditorStyleInput } from '~/components/EditorStyleInput';

export const EditProjectEditorStyle = () => {
  const toggleSettingsModal = useAppContext('toggleSettingsModal');

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
        syncWithLink={
          <button
            type="button"
            className="btn btn-link"
            onClick={() =>
              toggleSettingsModal({ initialSection: 'appearance' })
            }
          >
            Open settings
          </button>
        }
        className="md:grid-cols-3"
      />
    </div>
  );
};
