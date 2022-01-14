import React from 'react'
import { useRef } from 'react'

import Modal from 'components/Modal'

const TrixDialogs = props => {
  const inputEl = useRef(null)

  return (
    <div id="trix-dialogs">
      <Modal
        id="trix-dialog-href"
        title="Link Options"
        data-trix-dialog="href"
        data-trix-dialog-attribute="href"
        onShow={() => inputEl.current.select()}>
        <div className="form-floating mb-4">
          <input
            ref={inputEl}
            type="url"
            name="href"
            id="trix-dialog-href-input"
            className="form-control"
            placeholder="Link URL"
            required
            autoFocus
            data-trix-input />

          <label htmlFor="trix-dialog-href-input">Link URL</label>
        </div>

        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-lg btn-primary"
            data-trix-method="setAttribute">
            Create Link
          </button>

          {' '}

          <button
            type="button"
            className="btn btn-lg btn-light text-danger"
            data-trix-method="removeAttribute">
            Remove Link
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default TrixDialogs
