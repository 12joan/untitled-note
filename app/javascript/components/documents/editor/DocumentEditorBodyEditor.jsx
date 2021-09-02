import React from 'react'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import { TrixEditor } from 'react-trix'

const DocumentEditorBodyEditor = props => {
  const [collapsed, setCollapsed] = useState(props.startCollapsedIfLong ? undefined : false)

  const handleClick = event => {
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

  if (props.readOnly || collapsed !== false) {
    return (
      <StaticBody
        doc={props.doc}
        gotPreferredHeight={height => setCollapsed(height > 80)}
        collapsed={collapsed}
        onClick={handleClick}
        setCollapsed={setCollapsed} />
    )
  } else {
    return (
      <BodyEditor
        doc={props.doc}
        toolbarId={props.toolbarId}
        updateDocument={props.updateDocument}
        onClick={handleClick} />
    )
  }
}

const StaticBody = props => {
  const bodyEl = useRef()

  useEffect(() => {
    props.gotPreferredHeight(bodyEl.current.scrollHeight)
  }, [])

  return (
    <div
      className="position-relative"
      style={props.collapsed === undefined ? { height: 0, overflow: 'hidden' } : {}}>
      <div
        ref={bodyEl}
        className={`trix-editor ${props.collapsed ? 'collapsed' : ''}`}
        dangerouslySetInnerHTML={{ __html: props.doc.body }}
        onClick={event => {
          props.setCollapsed(false)
          props.onClick(event)
        }} />

      {
        props.collapsed && (
          <div className="position-absolute bottom-0 w-100 d-flex justify-content-center">
            <button
              type="button"
              className="show-more-button position-absolute bottom-0 btn btn-light rounded-pill"
              style={{ zIndex: 1 }}
              onClick={event => {
                event.preventDefault()
                props.setCollapsed(false)
              }}>
              Show more
            </button>
          </div>
        )
      }
    </div>
  )
}

const BodyEditor = props => {
  const editorEl = useRef()
  const editorLoaded = useRef(false)

  const handleEditorReady = () => {
    editorLoaded.current = false

    const editor = editorEl.current.editor
    editor.loadHTML(props.doc.body)

    editorLoaded.current = true

    editor.element.addEventListener('click', props.onClick)
  }

  return (
    <TrixEditor
      ref={editorEl}
      toolbar={props.toolbarId}
      placeholder="Add document body"
      onEditorReady={handleEditorReady}
      onChange={body => editorLoaded.current && props.updateDocument({ body })} />
  )
}

export default DocumentEditorBodyEditor
