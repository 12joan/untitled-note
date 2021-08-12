import React from 'react'
import { useRef, useEffect } from 'react'
import { TrixEditor } from 'react-trix'

const DocumentEditorBodyEditor = props => {
  const editorEl = useRef()
  const readOnlyEl = useRef()

  const onClick = event => {
    const { target } = event

    if (target.tagName === 'A') {
      event.preventDefault()
      event.stopPropagation()

      const newAnchorTag = document.createElement('a')
      newAnchorTag.href = target.href
      newAnchorTag.target = '_blank'
      newAnchorTag.click()
    }
  }

  const handleEditorReady = () => {
    const editor = editorEl.current.editor
    editor.loadHTML(props.doc.body)
    editor.element.addEventListener('click', onClick)
  }

  useEffect(() => {
    const container = readOnlyEl.current

    if (container === undefined || container === null) {
      return
    }

    container.addEventListener('click', onClick)

    return () => container.removeEventListener('click', onClick)
  }, [props.readOnly, readOnlyEl.current])

  if (props.readOnly) {
    return (
      <div
        ref={readOnlyEl}
        className="trix-editor"
        dangerouslySetInnerHTML={{ __html: props.doc.body }} />
    )
  } else {
    return (
      <TrixEditor
        ref={editorEl}
        toolbar={props.toolbarId}
        placeholder="Add document body"
        onEditorReady={handleEditorReady}
        onChange={body => props.updateDocument({ body })} />
    )
  }
}

export default DocumentEditorBodyEditor
