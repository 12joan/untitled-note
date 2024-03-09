import React from 'react';
import { EditProjectLink } from '~/lib/routes';
import { EditorStyleInput } from '~/components/EditorStyleInput';
import { DocumentSettingsModalSectionProps } from './types';

export const AppearanceSection = ({
  document: doc,
  updateDocument,
}: DocumentSettingsModalSectionProps) => {
  return (
    <div className="space-y-2">
      <h3 className="h3 select-none">Editor style</h3>

      <EditorStyleInput
        value={doc.editor_style}
        onChange={(editorStyle) =>
          updateDocument({ editor_style: editorStyle })
        }
        syncWithOption="project"
        syncWithLink={
          <EditProjectLink className="btn btn-link">
            View project settings
          </EditProjectLink>
        }
      />
    </div>
  );
};
