import React from 'react';
import { useAppContext } from '~/lib/appContext';
import { EditorStyleInput } from '~/components/EditorStyleInput';
import { DocumentSettingsModalSectionProps } from './types';

export const AppearanceSection = ({
  document: doc,
  updateDocument,
}: DocumentSettingsModalSectionProps) => {
  const toggleProjectSettingsModal = useAppContext(
    'toggleProjectSettingsModal'
  );

  return (
    <div className="space-y-2">
      <h4 className="h3 select-none">Editor style</h4>

      <EditorStyleInput
        value={doc.editor_style}
        onChange={(editorStyle) =>
          updateDocument({ editor_style: editorStyle })
        }
        syncWithOption="project"
        syncWithLink={
          <button
            type="button"
            className="btn btn-link"
            onClick={() =>
              toggleProjectSettingsModal({ initialSection: 'appearance' })
            }
          >
            Open project settings
          </button>
        }
      />
    </div>
  );
};
