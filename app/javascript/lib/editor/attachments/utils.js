import {
  someNode,
  getNodeEntries,
  removeNodes,
} from '@udecode/plate-headless'

import { ELEMENT_UPLOADING_ATTACHMENT } from './constants'

const matchUploadInProgressNode = id => node => (
  node.type === ELEMENT_UPLOADING_ATTACHMENT &&
  node.id === id
)

const uploadInProgressNodeExists = (editor, id) => someNode(editor, {
  at: [],
  match: matchUploadInProgressNode(id),
})

const findAllUploadInProgressNodes = (editor, id) => getNodeEntries(editor, {
  at: [],
  match: matchUploadInProgressNode(id),
})

const removeAllUploadInProgressNodes = (editor, id) => removeNodes(editor, {
  at: [],
  match: matchUploadInProgressNode(id),
})

export {
  uploadInProgressNodeExists,
  findAllUploadInProgressNodes,
  removeAllUploadInProgressNodes,
}
