import React from 'react'
import { useState } from 'react'
import { Palette, At as Mention } from 'react-bootstrap-icons'

import DocumentEditorSyncStatusIndicator from 'components/documents/editor/DocumentEditorSyncStatusIndicator'
import DocumentEditorToolbar from 'components/documents/editor/DocumentEditorToolbar'

const DocumentEditorFooter = props => {
  const toolbarCollapseId = `${props.toolbarId}-collapse`

  return (
    <div className={`document-editor-footer position-sticky bottom-0 pb-3`}>
      <div className="container-fluid">
        <div className="row gx-3 align-items-center mb-n3">
          <div className="col mb-3" style={{ width: 0 }}>
            <DocumentEditorToolbar toolbarId={props.toolbarId} toolbarCollapseId={toolbarCollapseId} />
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
              aria-controls={toolbarCollapseId}>
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

          <div className="col-auto mb-3">
            <DocumentEditorSyncStatusIndicator syncStatus={props.syncStatus} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditorFooter
