import {
  someNode,
  getNodeEntries,
  removeNodes,
  getNode,
  getEditorString,
  ELEMENT_PARAGRAPH,
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

const nodeAtPathIsEmptyParagraph = (editor, path) => {
  const node = getNode(editor, path)

  return node
    && node.type === ELEMENT_PARAGRAPH
    && getEditorString(editor, path).trim() === ''
}

export {
  matchUploadInProgressNode,
  uploadInProgressNodeExists,
  findAllUploadInProgressNodes,
  removeAllUploadInProgressNodes,
  nodeAtPathIsEmptyParagraph,
}
