import { streamAction } from 'channels/data_channel'

const DocumentsStream = projectId => ({
  index(params, callback) {
    return streamAction(
      'Document',
      'index',
      { query: 'all', ...params, project_id: projectId },
      docs => callback(docs.map(transformDocument)),
    )
  },

  show(id, params, callback) {
    return streamAction(
      'Document',
      'show',
      { query: 'all', ...params, project_id: projectId, id },
      doc => callback(transformDocument(doc)),
    )
  },
})

const transformDocument = doc => ({
  ...doc,
  body: doc.body_content,
})

export default DocumentsStream
