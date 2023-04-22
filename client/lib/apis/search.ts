import { fetchAPIEndpoint } from '~/lib/fetchAPIEndpoint';
import { DocumentSearchResult } from '~/lib/types';

type RawDocumentSearchResult = Omit<DocumentSearchResult, 'document'> & {
  document: Omit<DocumentSearchResult['document'], 'id'> & {
    id: string;
  };
};

export const fetchSearchResults = async (
  projectId: number,
  query: string
): Promise<DocumentSearchResult[]> => {
  const response = await fetchAPIEndpoint({
    path: `/api/v1/projects/${projectId}/search`,
    query: { q: query },
  });

  const rawSearchResults: RawDocumentSearchResult[] = await response.json();

  return rawSearchResults.map((rawSearchResult) => ({
    ...rawSearchResult,
    document: {
      ...rawSearchResult.document,
      id: parseInt(rawSearchResult.document.id, 10),
    },
  }));
};
