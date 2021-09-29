import ResourcesAPI from 'lib/ResourcesAPI'

const DocumentsAPI = projectId => new ResourcesAPI({
  apiEndpoints: {
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
      blank: false,
      pinned_at: doc.pinned_at,
    },
  }),
})

export default DocumentsAPI
