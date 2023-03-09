import { streamAction } from '~/channels/dataChannel'

const ProjectsStream = {
  index(params, callback) {
    return streamAction(
      'Project',
      'index',
      { query: 'all', ...params },
      callback,
    )
  },
}

export default ProjectsStream
