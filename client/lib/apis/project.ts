import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { Project } from '~/lib/types';

export interface CreateProjectOptions extends Partial<Project> {
  name: string;
}

export const createProject = (project: CreateProjectOptions) => (
  fetchAPIEndpoint({
    method: 'POST',
    path: '/api/v1/projects',
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
