import ResourcesAPI from 'lib/ResourcesAPI'

const DocumentsAPI = new ResourcesAPI({
  apiEndpoints: {
    index: {
      url: () => '/api/v1/documents',
      method: 'GET',
    },

    show: {
      url: id => `/api/v1/documents/${id}`,
      method: 'GET',
    },

    create: {
      url: () => '/api/v1/documents',
      method: 'POST',
    },

    update: {
      url: id => `/api/v1/documents/${id}`,
      method: 'PUT',
    },

    destroy: {
      url: id => `/api/v1/documents/${id}`,
      method: 'DELETE',
    },
  },

  transformRequestParams: doc => ({
    document: {
      body: doc.body,
    },
  }),
})

export default DocumentsAPI
