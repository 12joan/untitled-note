import { streamAction } from '~/channels/dataChannel'

const TagsStream = projectId => ({
  index(params, callback) {
    return streamAction(
      'Keyword',
      'index',
      { query: 'all', ...params, project_id: projectId },
      callback,
    )
  },
})

export default TagsStream
