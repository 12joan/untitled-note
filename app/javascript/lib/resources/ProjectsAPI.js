import ResourcesAPI from '~/lib/ResourcesAPI'

const ProjectsAPI = new ResourcesAPI({
  apiEndpoints: {
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
      emoji: project.emoji,
      background_colour: project.background_colour,
      archived_at: project.archived_at,
    },
  }),
})

export default ProjectsAPI
