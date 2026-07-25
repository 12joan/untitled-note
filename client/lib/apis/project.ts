import { streamAction } from '~/channels/dataChannel';
import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import type { Project } from '~/lib/types';

export const createProject = (
  project: Partial<Project> & {
    name: Project['name'];
  }
) =>
  fetchAPIEndpoint({
    method: 'POST',
    path: '/api/v1/projects',
    data: { project },
  }).then((response) => response.json()) as Promise<Project>;

export const updateProject = (projectId: number, project: Partial<Project>) =>
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/projects/${projectId}`,
    data: { project },
  }).then((response) => response.json()) as Promise<Project>;

export const deleteProject = (projectId: number) =>
  fetchAPIEndpoint({
    method: 'DELETE',
    path: `/api/v1/projects/${projectId}`,
  });

export const updateProjectImage = (projectId: number, fileId: number | null) =>
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/projects/${projectId}/image`,
    data: { image_id: fileId },
  });

export const streamProjects = (callback: (projects: Project[]) => void) =>
  streamAction(
    'Project',
    'index',
    {
      query: 'all',
    },
    callback
  );
