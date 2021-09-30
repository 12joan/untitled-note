import React from 'react'
import { useRef, useEffect } from 'react'
import { TrixEditor } from 'react-trix'

const DocumentEditorBodyEditor = props => {
  const editorEl = useRef()
  const editorLoaded = useRef(false)

  const handleEditorReady = () => {
    // Prevent loadHTML from sending an update event
    editorLoaded.current = false

    const editor = editorEl.current.editor
    editor.loadHTML(props.doc.body)

    editorLoaded.current = true

    editor.element.addEventListener('click', handleClick)
  }

  const handleClick = event => {
    const { target } = event

    // Open all links with target _blank
    if (target.tagName === 'A') {
      event.preventDefault()
      event.stopPropagation()

      const newAnchorTag = document.createElement('a')
      newAnchorTag.href = target.href
      newAnchorTag.target = '_blank'
      newAnchorTag.click()
    }
  }

  return (
    <TrixEditor
      ref={editorEl}
      toolbar={props.toolbarId}
      placeholder="Add document body"
      onEditorReady={handleEditorReady}
      onChange={body => editorLoaded.current && props.updateDocument({ body }, { updateImmediately: false })} />
  )
}

export default DocumentEditorBodyEditor
