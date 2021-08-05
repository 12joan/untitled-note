const RouteConfig = {
  projects: {
    url: '/projects',

    new: { url: '/projects/new' },

    show: projectId => ({
      url: `/projects/${projectId}`,

      edit: `/projects/${projectId}/edit`,

      documents: {
        url: `/projects/${projectId}/documents`,

        new: { url: `/projects/${projectId}/documents/new` },
        show: documentId => ({ url: `/projects/${projectId}/documents/${documentId}` }),
      },
    }),
  },
}

export default RouteConfig
