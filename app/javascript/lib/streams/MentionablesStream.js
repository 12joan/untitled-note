import { streamAction } from '~/channels/data_channel'

const MentionablesStream = projectId => ({
  index(params, callback) {
    return streamAction(
      'Mentionable',
      'index',
      { ...params, project_id: projectId },
      callback,
    )
  },
})

export default MentionablesStream
