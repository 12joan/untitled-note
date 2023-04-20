import { streamAction } from '~/channels/dataChannel';
import { PartialDocument, Document } from '~/lib/types';
import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';

export interface CreateBlankDocumentOptions {
  projectId: number;
  tagId?: number;
}

export const createBlankDocument = ({
  projectId,
  tagId,
}: CreateBlankDocumentOptions) => (
  fetchAPIEndpoint({
    method: 'POST',
    path: `/api/v1/projects/${projectId}/blank_document`,
    data: { tag_id: tagId },
  }).then((response) => response.json()) as Promise<Document>
);

export interface StreamDocumentsOptions {
  projectId: number;
  params: Record<string, any>;
  callback: (data: PartialDocument[]) => void;
}

export const streamDocuments = ({
  projectId,
  params,
  callback
}: StreamDocumentsOptions) => streamAction(
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
