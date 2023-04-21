import React from 'react';
import { LogoutLink } from '~/lib/routes';
import { useNewProject } from '~/lib/useNewProject';
import { useTitle } from '~/lib/useTitle';

export const NoProjectsView = () => {
  useTitle('Create a project');

  const { modal: newProjectModal, open: openNewProjectModal } = useNewProject();

  return (
    <div className="grow flex p-5">
      {newProjectModal}

      <div className="m-auto lg:narrow space-y-3">
        <h1 className="h1">Create a project</h1>

        <p className="text-lg font-light">
          You don&apos;t have any projects yet. Create one to get started.
        </p>

        <button
          type="button"
          className="btn btn-rect btn-primary"
          onClick={openNewProjectModal}
        >
          New project
        </button>

        <p>
          <LogoutLink className="btn btn-link font-medium">Log out</LogoutLink>
        </p>
      </div>
    </div>
  );
};