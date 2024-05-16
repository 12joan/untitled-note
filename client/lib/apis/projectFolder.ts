import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { ProjectFolder } from '~/lib/types';

import { streamAction } from '~/channels/dataChannel';

export const createProjectFolder = (
  projectFolder: Partial<ProjectFolder> & {
    name: ProjectFolder['name'];
  }
) =>
  fetchAPIEndpoint({
    method: 'POST',
    path: '/api/v1/project_folders',
    data: { project_folder: projectFolder },
  }).then((response) => response.json()) as Promise<ProjectFolder>;

export const updateProjectFolder = (
  projectFolderId: number,
  projectFolder: Partial<ProjectFolder>
) =>
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/project_folders/${projectFolderId}`,
    data: { project_folder: projectFolder },
  }).then((response) => response.json()) as Promise<ProjectFolder>;

export const deleteProjectFolder = (projectFolderId: number) =>
  fetchAPIEndpoint({
    method: 'DELETE',
    path: `/api/v1/project_folders/${projectFolderId}`,
  });

export const streamProjectFolders = (
  callback: (projects: ProjectFolder[]) => void
) =>
  streamAction(
    'ProjectFolder',
    'index',
    {
      query: 'all',
    },
    callback
  );
