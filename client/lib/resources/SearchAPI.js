import fetchAPIEndpoint from '~/lib/fetchAPIEndpoint'

const SearchAPI = projectId => ({
  search: query => fetchAPIEndpoint(
    { url: () => `/api/v1/projects/${projectId}/search` },
    { searchParams: { q: query } }
  ).then(response => response.json()),
})

export default SearchAPI
