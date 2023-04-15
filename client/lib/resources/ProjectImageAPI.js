import ResourcesAPI from '~/lib/ResourcesAPI';

const ProjectImageAPI = (projectId) =>
  new ResourcesAPI({
    apiEndpoints: {
      update: {
        url: () => `/api/v1/projects/${projectId}/image`,
        method: 'PUT',
      },
    },
  });

export default ProjectImageAPI;
