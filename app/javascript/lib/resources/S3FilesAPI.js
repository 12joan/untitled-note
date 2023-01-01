import ResourcesAPI from '~/lib/ResourcesAPI'

const S3FilesAPI = projectId => new ResourcesAPI({
  apiEndpoints: {
    show: {
      url: id => `/api/v1/projects/${projectId}/s3_files/${id}`,
      method: 'GET'
    },

    create: {
      url: () => `/api/v1/projects/${projectId}/s3_files`,
      method: 'POST',
    },

    destroy: {
      url: id => `/api/v1/projects/${projectId}/s3_files/${id}`,
      method: 'DELETE',
    },
  },
})

export default S3FilesAPI
