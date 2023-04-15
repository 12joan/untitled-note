import fetchAPIEndpoint from '~/lib/fetchAPIEndpoint';

const DocumentSearchAPI = (projectId) => ({
  search: (q, options = {}) =>
    fetchAPIEndpoint({
      url: () => {
        const params = new URLSearchParams();

        params.append('q', q);
        params.append('select', options.select ?? 'all');

        return `/api/v1/projects/${projectId}/document_search?${params.toString()}`;
      },
    }).then((response) => response.json()),
});

export default DocumentSearchAPI;
