import ResourcesAPI from 'lib/ResourcesAPI'

const KeywordsAPI = projectId => new ResourcesAPI({
  apiEndpoints: {
    index: {
      url: () => `/api/v1/projects/${projectId}/keywords`,
      method: 'GET',
    },

    show: {
      url: id => `/api/v1/projects/${projectId}/keywords/${id}`,
      method: 'GET',
    },

    create: {
      url: () => `/api/v1/projects/${projectId}/keywords`,
      method: 'POST',
    },

    update: {
      url: id => `/api/v1/projects/${projectId}/keywords/${id}`,
      method: 'PUT',
    },

    destroy: {
      url: id => `/api/v1/projects/${projectId}/keywords/${id}`,
      method: 'DELETE',
    },
  },

  transformRequestParams: keyword => ({
    keyword: {
      text: keyword.text,
    },
  }),
})

export default KeywordsAPI
