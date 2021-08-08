import ResourcesAPI from 'lib/ResourcesAPI'

const DocumentsAPI = projectId => new ResourcesAPI({
  apiEndpoints: {
    index: {
      url: () => `/api/v1/projects/${projectId}/documents`,
      method: 'GET',
    },

    show: {
      url: id => `/api/v1/projects/${projectId}/documents/${id}`,
      method: 'GET',
    },

    create: {
      url: () => `/api/v1/projects/${projectId}/documents`,
      method: 'POST',
    },

    update: {
      url: id => `/api/v1/projects/${projectId}/documents/${id}`,
      method: 'PUT',
    },

    destroy: {
      url: id => `/api/v1/projects/${projectId}/documents/${id}`,
      method: 'DELETE',
    },
  },

  transformRequestParams: doc => ({
    document: {
      title: doc.title,
      body: doc.body,
      keywords_attributes: doc.keywords.map(keyword => ({
        text: keyword.text,
      })),
    },
  }),
})

export default DocumentsAPI
