import React from 'react';
import { useAppContext } from '~/lib/appContext';
import { useLocalProject } from '~/lib/useLocalProject';
import { useOverrideable } from '~/lib/useOverrideable';
import { useWaitUntilSettled } from '~/lib/useWaitUntilSettled';
import { EditorStyleInput } from '~/components/EditorStyleInput';

export const AppearanceSection = () => {
  const toggleSettingsModal = useAppContext('toggleSettingsModal');

  const [localProject, updateProject] = useLocalProject();
  const [editorStyle, setEditorStyle] = useOverrideable(
    localProject.editor_style
  );

  useWaitUntilSettled(
    editorStyle,
    () => {
      updateProject({ editor_style: editorStyle });
    },
    { fireOnUnmount: true }
  );

  return (
    <div className="space-y-2">
      <h4 className="h3 select-none">Editor style</h4>

      <EditorStyleInput
        value={editorStyle}
        onChange={setEditorStyle}
        syncWithOption="user preferences"
        syncWithLink={
          <button
            type="button"
            className="btn btn-link"
            onClick={() =>
              toggleSettingsModal({ initialSection: 'appearance' })
            }
          >
            Open user preferences
          </button>
        }
      />
    </div>
  );
};
