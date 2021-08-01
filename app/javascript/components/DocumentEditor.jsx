import React from 'react'
import { useState } from 'react'
import { TrixEditor } from 'react-trix'

const DocumentEditor = props => {
  const { document } = props
  const toolbarId = `trix-toolbar-document-${document.id}`
  const toolbarCollapseId = `${toolbarId}-collapse`

  const [body, setBody] = useState(document.body)

  const handleChange = body => {
    setBody(body)

    fetch(`/api/v1/documents/${document.id}`, {
      method: 'PUT',
      headers: {
        "X-CSRF-Token": window.document.querySelector("[name='csrf-token']").content,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        document: {
          ...document,
          body,
        },
      }),
    })
  }

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
        <trix-toolbar
          id={toolbarId} />
      </div>

      <TrixEditor
        toolbar={toolbarId}
        placeholder="Add document body"
        value={body}
        onChange={handleChange} />
    </div>
  )
}

export default DocumentEditor
