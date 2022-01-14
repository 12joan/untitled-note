import React from 'react'

const DocumentEditorSyncFailedToast = props => {
  return (props.syncStatus === 'failed') && (
    <div className="position-absolute top-0 end-0 w-100">
      <div className="position-fixed end-0 p-3" id="toastPlacement" style={{ zIndex: 11 }}>
        <div className="toast text-white bg-danger border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
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
                onClick={() => alert('Not implemented yet')}>
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
      </div>
    </div>
  )
}

export default DocumentEditorSyncFailedToast
