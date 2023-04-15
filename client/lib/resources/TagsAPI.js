import ResourcesAPI from '~/lib/ResourcesAPI';

const TagsAPI = (projectId) =>
  new ResourcesAPI({
    apiEndpoints: {
      update: {
        url: (id) => `/api/v1/projects/${projectId}/tags/${id}`,
        method: 'PUT',
      },
    },
  });

export default TagsAPI;
