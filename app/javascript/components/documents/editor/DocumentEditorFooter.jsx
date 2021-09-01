import React from 'react'
import { useState } from 'react'
import { Palette, At as Mention } from 'react-bootstrap-icons'

import DocumentEditorSyncStatusIndicator from 'components/documents/editor/DocumentEditorSyncStatusIndicator'
import DocumentEditorToolbar from 'components/documents/editor/DocumentEditorToolbar'

const DocumentEditorFooter = props => {
  const toolbarCollapseId = `${props.toolbarId}-collapse`

  return (
    <div className={`document-editor-footer position-sticky py-1`} style={{ bottom: '-1rem' }}>
      <div className="container-fluid mb-3">
        <div className="row gx-3 align-items-center">
          <div className="col" style={{ width: 0 }}>
            <DocumentEditorToolbar toolbarId={props.toolbarId} toolbarCollapseId={toolbarCollapseId} />
          </div>

          <div className="col-auto ms-auto">
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

          <div className="col-auto">
            <DocumentEditorSyncStatusIndicator syncStatus={props.syncStatus} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditorFooter
