import { streamAction } from '~/channels/data_channel'

const KeywordsStream = projectId => ({
  index(params, callback) {
    return streamAction(
      'Keyword',
      'index',
      { query: 'all', ...params, project_id: projectId },
      callback,
    )
  },
})

export default KeywordsStream
