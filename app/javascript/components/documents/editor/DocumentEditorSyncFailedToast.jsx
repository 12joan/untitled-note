import React from 'react'
import { useState } from 'react'

const DocumentEditorSyncFailedToast = props => {
  const [copied, setCopied] = useState(false)

  const performCopy = () => {
    const editor = document.querySelector('trix-editor').editor
    editor.setSelectedRange([0, editor.getDocument().toString().length - 1])
    document.execCommand('copy')
    setCopied(true)
  }

  return (
    <div className="position-absolute top-0 end-0 w-100">
      <div className="position-fixed end-0 p-3" style={{ zIndex: 11 }}>
        <div className="toast text-white bg-danger border-0 show mb-3" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="layout-row">
            <div className="toast-body">
              <h6>
                Unable to save changes&hellip;
                <span className="spinner-border spinner-border-sm ms-2" />
              </h6>

              <p className="mb-2">We'll keep trying. Just to be safe, copy and paste your document into another text editor.</p>

              <button
                type="button"
                className="btn btn-light btn-sm border-0"
                onClick={performCopy}>
                Copy document
              </button>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white m-2"
              data-bs-dismiss="toast"
              aria-label="Close" />
          </div>
        </div>

        {
          copied && (
            <div className="toast text-white bg-success border-0 show mb-3" role="alert" aria-live="polite" aria-atomic="true">
              <div className="layout-row">
                <div className="toast-body">
                  <h6>Document copied to clipboard</h6>

                  <p className="mb-0">
                    We copied the document to your clipboard. Paste it into another text editor to keep it safe, and{' '}
                    <a href="#" className="text-white" onClick={() => window.location.reload()}>refresh this page</a>.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-close btn-close-white m-2"
                  data-bs-dismiss="toast"
                  aria-label="Close" />
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default DocumentEditorSyncFailedToast
