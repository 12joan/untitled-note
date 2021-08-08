import ResourcesAPI from 'lib/ResourcesAPI'

const KeywordDocumentsAPI = (projectId, keywordId) => new ResourcesAPI({
  apiEndpoints: {
    index: {
      url: () => `/api/v1/projects/${projectId}/keywords/${keywordId}/keyword_documents`,
      method: 'GET',
    },
  },
})

export default KeywordDocumentsAPI
