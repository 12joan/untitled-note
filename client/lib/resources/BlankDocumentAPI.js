import ResourcesAPI from '~/lib/ResourcesAPI'

const BlankDocumentAPI = (projectId) => new ResourcesAPI({
  apiEndpoints: {
    create: {
      url: () => `/api/v1/projects/${projectId}/blank_document`,
      method: 'POST',
    },
  },
})

export default BlankDocumentAPI
