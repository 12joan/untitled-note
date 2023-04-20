import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { Project } from '~/lib/types';

export const createProject = (
  project: Partial<Project> & {
    name: Project['name'];
  }
) => (
  fetchAPIEndpoint({
    method: 'POST',
    path: '/api/v1/projects',
    data: { project },
  }).then((response) => response.json()) as Promise<Project>
);

export const updateProject = (
  projectId: number,
  project: Partial<Project>
) => (
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/projects/${projectId}`,
    data: { project },
  }).then((response) => response.json()) as Promise<Project>
);

export const updateProjectOrder = (order: Project['id'][]) => (
  fetchAPIEndpoint({
    method: 'PUT',
    path: '/api/v1/project_order',
    data: { order },
  })
);

export const deleteProject = (projectId: number) => (
  fetchAPIEndpoint({
    method: 'DELETE',
    path: `/api/v1/projects/${projectId}`,
  })
);
