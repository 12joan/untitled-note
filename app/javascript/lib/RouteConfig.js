const RouteConfig = {
  rootUrl: '/',

  projects: {
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
