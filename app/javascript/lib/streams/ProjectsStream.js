import { streamAction } from 'channels/data_channel'

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
