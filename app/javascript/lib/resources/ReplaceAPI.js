import fetchAPIEndpoint from '~/lib/fetchAPIEndpoint'

const ReplaceAPI = projectId => ({
  replaceInProject: ({ find, replace }) => fetchAPIEndpoint(
    {
      method: 'POST',
      url: () => `/api/v1/projects/${projectId}/replace`,
    },
    {
      body: JSON.stringify({ find, replace }),
    },
  ),

  replaceInDocument: ({ documentId, find, replace }) => fetchAPIEndpoint(
    {
      method: 'POST',
      url: () => `/api/v1/projects/${projectId}/documents/${documentId}/replace`,
    },
    {
      body: JSON.stringify({ document: documentId, find, replace }),
    },
  ),
})

export default ReplaceAPI
