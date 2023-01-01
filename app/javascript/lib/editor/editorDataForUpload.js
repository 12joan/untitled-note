import { ELEMENT_MENTION_INPUT } from '@udecode/plate-headless'

import { ELEMENT_UPLOADING_ATTACHMENT } from '~/lib/editor/attachments'
import filterDescendants from '~/lib/editor/filterDescendants'
import getPlainBody from '~/lib/editor/getPlainBody'

const excludedTypes = [ELEMENT_MENTION_INPUT, ELEMENT_UPLOADING_ATTACHMENT]

const editorDataForUpload = editor => {
  const filteredEditor = filterDescendants(editor, ({ type }) => !excludedTypes.includes(type))

  return {
    body: JSON.stringify(filteredEditor.children),
    body_type: 'json/slate',
    plain_body: getPlainBody(filteredEditor),
  }
}

export default editorDataForUpload
