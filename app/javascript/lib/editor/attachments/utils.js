import {
  someNode,
  getNodeEntries,
  removeNodes,
  getNode,
  getEditorString,
  ELEMENT_PARAGRAPH,
} from '@udecode/plate-headless'
import {
  useSelected as useSlateSelected,
  useFocused as useSlateFocused,
} from 'slate-react'

import { ELEMENT_ATTACHMENT } from './constants'

const matchAttachmentNode = id => node => (
  node.type === ELEMENT_ATTACHMENT &&
  node.s3FileId === id
)

const attachmentNodeExists = (editor, id) => someNode(editor, {
  at: [],
  match: matchAttachmentNode(id),
})

const removeAllAttachmentNodes = (editor, id) => removeNodes(editor, {
  at: [],
  match: matchAttachmentNode(id),
})

const nodeAtPathIsEmptyParagraph = (editor, path) => {
  const node = getNode(editor, path)

  return node
    && node.type === ELEMENT_PARAGRAPH
    && getEditorString(editor, path).trim() === ''
}

const useSelected = () => useSlateSelected() & useSlateFocused()

export {
  matchAttachmentNode,
  attachmentNodeExists,
  removeAllAttachmentNodes,
  nodeAtPathIsEmptyParagraph,
  useSelected,
}
