import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { SequenceBeforeAndAfter, Tag } from '~/lib/types';

import { streamAction } from '~/channels/dataChannel';

export const updateTag = (projectId: number, id: number, tag: Partial<Tag>) =>
  fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/projects/${projectId}/tags/${id}`,
    data: { tag },
  }).then((response) => response.json()) as Promise<Tag>;

export const streamTags = (
  projectId: number,
  callback: (tags: Tag[]) => void
) =>
  streamAction(
    'Tag',
    'index',
    {
      project_id: projectId,
      query: 'all',
    },
    callback
  );

export const streamSequenceBeforeAndAfter = (
  projectId: number,
  sequenceTagId: number,
  documentId: number,
  callback: (result: SequenceBeforeAndAfter) => void
) =>
  streamAction(
    'Tag',
    'sequence',
    {
      project_id: projectId,
      id: sequenceTagId,
      document_id: documentId,
    },
    callback
  );
