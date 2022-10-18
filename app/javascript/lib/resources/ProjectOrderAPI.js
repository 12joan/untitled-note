import ResourcesAPI from '~/lib/ResourcesAPI'

const ProjectOrderAPI = new ResourcesAPI({
  apiEndpoints: {
    update: {
      url: id => '/api/v1/project_order',
      method: 'PUT',
    },
  },

  resourceId: () => null,
})

export default ProjectOrderAPI
