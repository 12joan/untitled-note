import ResourcesAPI from '~/lib/ResourcesAPI';

const DocumentsAPI = (projectId) =>
  new ResourcesAPI({
    apiEndpoints: {
      show: {
        url: (id) => `/api/v1/projects/${projectId}/documents/${id}`,
        method: 'GET',
      },

      create: {
        url: () => `/api/v1/projects/${projectId}/documents`,
        method: 'POST',
      },

      update: {
        url: (id) => `/api/v1/projects/${projectId}/documents/${id}`,
        method: 'PUT',
      },

      destroy: {
        url: (id) => `/api/v1/projects/${projectId}/documents/${id}`,
        method: 'DELETE',
      },
    },

    transformRequestParams: (doc) => ({
      document: {
        title: doc.title,
        body: doc.body,
        body_type: doc.body_type,
        plain_body: doc.plain_body,
        tags_attributes: doc.tags?.map((tag) => ({
          text: tag.text,
        })),
        blank: false,
        updated_by: doc.updated_by,
        pinned_at: doc.pinned_at,
      },
    }),
  });

export default DocumentsAPI;
