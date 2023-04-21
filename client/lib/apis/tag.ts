import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { streamAction } from '~/channels/dataChannel';
import { Tag } from '~/lib/types';

export const updateTag = (
  projectId: number,
  id: number,
  tag: Partial<Tag>
) => (
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/projects/${projectId}/tags/${id}`,
    data: { tag },
  }).then((response) => response.json()) as Promise<Tag>
);

export const streamTags = (
  projectId: number,
  callback: (tags: Tag[]) => void
) => streamAction(
  'Tag',
  'index',
  {
    project_id: projectId,
    query: 'all',
  },
  callback
);
