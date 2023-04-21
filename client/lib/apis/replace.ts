import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';

export type ReplaceOptions = {
  find: string;
  replace: string;
};

export type ReplaceResult = {
  occurrences: number;
  documents: number;
};

export const replaceInProject = (
  projectId: number,
  options: ReplaceOptions
) => fetchAPIEndpoint({
  method: 'POST',
  path: `/api/v1/projects/${projectId}/replace`,
  data: options,
}).then((response) => response.json()) as Promise<ReplaceResult>;

export const replaceInDocument = (
  projectId: number,
  documentId: number,
  options: ReplaceOptions
) => fetchAPIEndpoint({
  method: 'POST',
  path: `/api/v1/projects/${projectId}/documents/${documentId}/replace`,
  data: options,
}).then((response) => response.json()) as Promise<ReplaceResult>;
