import React from 'react'
import { useState } from 'react'
import { Palette, At as Mention } from 'react-bootstrap-icons'

const DocumentEditorFooter = props => {
  const toolbarCollapseId = `${props.toolbarId}-collapse`

  const [sticky, setSticky] = useState(false)

  const updateSticky = event => {
    setSticky(event.currentTarget.getAttribute('aria-expanded') === 'true')
  }

  return (
    <div className={`document-editor-footer ${sticky ? 'position-sticky' : ''} bottom-0 py-3`}>
      <div className="container-fluid">
        <div className="row gx-3 align-items-center mb-n3">
          <div className="col mb-3">
            <div className="collapse" style={{ marginBottom: '-10px' }} id={toolbarCollapseId}>
              <trix-toolbar id={props.toolbarId} />
            </div>
          </div>

          <div className="col-auto ms-auto mb-3">
            <button
              className="btn btn-icon fs-5 text-secondary ms-1"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#${toolbarCollapseId}`}
              title="Toggle formatting controls"
              disabled={props.readOnly}
              aria-expanded="false"
              aria-controls={toolbarCollapseId}
              onClick={updateSticky}>
              <Palette className="bi" />
              <span className="visually-hidden">Toggle formatting controls</span>
            </button>

            <button
              className="btn btn-icon fs-5 text-secondary ms-1"
              type="button"
              title="Related documents">
              <Mention className="bi" style={{ transform: 'scale(1.4)' }} />
              <span className="visually-hidden">Open related documents sidebar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditorFooter
