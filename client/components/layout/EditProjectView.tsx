import React, { memo } from 'react';
import { useAppContext } from '~/lib/appContext';
import { useTitle } from '~/lib/useTitle';
import { BackButton } from '~/components/BackButton';
import { EditProjectIcon } from '~/components/EditProjectIcon';
import { EditProjectName } from '~/components/EditProjectName';
import { ProjectActions } from '~/components/ProjectActions';
import {EditProjectEditorStyle} from '../EditProjectEditorStyle';

export const EditProjectView = memo(() => {
  const project = useAppContext('project');

  useTitle(`Edit ${project.name}`);

  return (
    <div className="grow lg:narrow flex flex-col">
      <BackButton className="mb-3" />

      <div className="space-y-10">
        <div className="space-y-5">
          <h1 className="h1 select-none">Edit project</h1>
          <EditProjectName />
          <EditProjectIcon />
          <EditProjectEditorStyle />
        </div>

        <ProjectActions />
      </div>
    </div>
  );
});
