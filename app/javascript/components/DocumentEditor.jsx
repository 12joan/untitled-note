import React from 'react'
import { ReactTrixRTEInput as TrixInput, ReactTrixRTEToolbar as TrixToolbar } from 'react-trix-rte'

const DocumentEditor = props => {
  const { document } = props
  const toolbarId = `trix-toolbar-document-${document.id}`
  const toolbarCollapseId = `${toolbarId}-collapse`

  return (
    <div className="document-editor mb-5">
      <div className="container-fluid">
        <div className="row mx-n3 g-3 align-items-center mb-2">
          <div className="col flex-grow-1">
            <h1 className="border-bottom">
              Document {document.id}
            </h1>
          </div>

          <div className="col-auto">
            <button
              className="btn-toggle-formatting-toolbar"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#${toolbarCollapseId}`}
              aria-expanded="false"
              aria-controls={toolbarCollapseId}>
              Aa
            </button>
          </div>
        </div>
      </div>

      <div className="collapse" id={toolbarCollapseId}>
        <TrixToolbar
          toolbarId={toolbarId} />
      </div>

      <TrixInput
        toolbarId={toolbarId}
        placeholder="Add document body"
        defaultValue={document.body} />
    </div>
  )
}

export default DocumentEditor
