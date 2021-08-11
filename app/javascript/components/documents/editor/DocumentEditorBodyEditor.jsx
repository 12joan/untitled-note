import React from 'react'
import { useRef } from 'react'
import { TrixEditor } from 'react-trix'

const DocumentEditorBodyEditor = props => {
  const editorEl = useRef()

  const handleEditorReady = () => {
    const editor = editorEl.current.editor
    editor.loadHTML(props.doc.body)
  }

  return (
    <TrixEditor
      ref={editorEl}
      toolbar={props.toolbarId}
      placeholder="Add document body"
      onEditorReady={handleEditorReady}
      onChange={body => props.updateDocument({ body })} />
  )
}

export default DocumentEditorBodyEditor
