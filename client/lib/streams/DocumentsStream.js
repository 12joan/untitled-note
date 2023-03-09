import { streamAction } from '~/channels/dataChannel'

const DocumentsStream = projectId => ({
  index(params, callback) {
    return streamAction(
      'Document',
      'index',
      { query: 'all', ...params, project_id: projectId },
      docs => callback(docs),
    )
  },
})

export default DocumentsStream
