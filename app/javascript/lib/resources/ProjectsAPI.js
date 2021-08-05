import ResourcesAPI from 'lib/ResourcesAPI'

const ProjectsAPI = new ResourcesAPI({
  apiEndpoints: {
    index: {
      url: () => '/api/v1/projects',
      method: 'GET',
    },

    show: {
      url: id => `/api/v1/projects/${id}`,
      method: 'GET',
    },

    create: {
      url: () => '/api/v1/projects',
      method: 'POST',
    },

    update: {
      url: id => `/api/v1/projects/${id}`,
      method: 'PUT',
    },

    destroy: {
      url: id => `/api/v1/projects/${id}`,
      method: 'DELETE',
    },
  },

  transformRequestParams: project => ({
    project: {
      name: project.name,
    },
  }),
})

export default ProjectsAPI
