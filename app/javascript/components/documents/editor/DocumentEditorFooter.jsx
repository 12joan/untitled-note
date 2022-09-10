import React from 'react'
import { useState } from 'react'
import { Palette, At as Mention } from 'react-bootstrap-icons'

import DocumentEditorSyncStatusIndicator from '~/components/documents/editor/DocumentEditorSyncStatusIndicator'
import DocumentEditorToolbar from '~/components/documents/editor/DocumentEditorToolbar'

const DocumentEditorFooter = props => {
  return (
    <div className="document-editor-footer bg-white p-2 pt-0">
      <div className="layout-row gap-3 align-items-center bg-light rounded-pill">
        <div className="flex-grow-1" style={{ width: 0 }}>
          <DocumentEditorToolbar toolbarId={props.toolbarId} />
        </div>

        <div className="ms-auto p-2">
          <DocumentEditorSyncStatusIndicator syncStatus={props.syncStatus} />
        </div>
      </div>
    </div>
  )
}

export default DocumentEditorFooter
