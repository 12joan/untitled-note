import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { Document, LocalDocument, PartialDocument } from '~/lib/types';

import { streamAction } from '~/channels/dataChannel';

export const createBlankDocument = (
  projectId: number,
  { tagId }: { tagId?: number } = {}
) =>
  fetchAPIEndpoint({
    method: 'POST',
    path: `/api/v1/projects/${projectId}/blank_document`,
    data: { tag_id: tagId },
  }).then((response) => response.json()) as Promise<Document>;

export const fetchDocument = (projectId: number, id: number) =>
  fetchAPIEndpoint({
    path: `/api/v1/projects/${projectId}/documents/${id}`,
  }).then((response) => response.json()) as Promise<Document>;

type DocumentRequestData = Partial<
  Omit<LocalDocument, 'tags'> & {
    tags_attributes: { text: string }[];
  }
>;

export const updateDocument = (
  projectId: number,
  id: number,
  { tags, ...delta }: Partial<LocalDocument>
) => {
  const data: DocumentRequestData = {
    ...delta,
    tags_attributes: tags?.map((tag) => ({
      text: tag.text,
    })),
  };

  return fetchAPIEndpoint({
    method: 'PUT',
    path: `/api/v1/projects/${projectId}/documents/${id}`,
    data,
  }).then((response) => response.json()) as Promise<Document>;
};

export const deleteDocument = (projectId: number, id: number) =>
  fetchAPIEndpoint({
    method: 'DELETE',
    path: `/api/v1/projects/${projectId}/documents/${id}`,
  }).then((response) => response.json()) as Promise<Document>;

export const streamDocuments = (
  projectId: number,
  params: Record<string, any>,
  callback: (documents: PartialDocument[]) => void
) =>
  streamAction(
    'Document',
    'index',
    {
      project_id: projectId,
      query: {
        id: true,
        title: true,
        safe_title: true,
        preview: true,
        blank: true,
        updated_by: true,
        updated_at: true,
        pinned_at: true,
      },
      ...params,
    },
    callback
  );
