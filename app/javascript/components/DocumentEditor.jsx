import React from 'react'
import { useState, useEffect } from 'react'
import { TrixEditor } from 'react-trix'
import { v4 as uuid } from 'uuid'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

const DocumentEditor = props => {
  const [editorUUID] = useState(() => uuid())

  const toolbarId = `trix-toolbar-${editorUUID}`
  const toolbarCollapseId = `${toolbarId}-collapse`

  const [doc, setDoc] = useState(props.id === undefined ? { body: '' } : undefined)
  const [isDirty, setIsDirty] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (props.id !== undefined) {
      DocumentsAPI.show(props.id)
        .then(setDoc)
    }
  }, [props.id])

  useEffect(() => {
    if (isDirty && !isUploading) {
      setIsUploading(true)

      const uploadDocumentPromise = doc.id === undefined
        ? DocumentsAPI.create(doc).then(setDoc)
        : DocumentsAPI.update(doc)

      uploadDocumentPromise
        .catch(console.error)
        .then(() => {
          setIsDirty(false)
          setIsUploading(false)
        })
    }
  }, [doc, isDirty])

  const updateDocument = params => {
    setDoc(doc => ({
      ...doc,
      ...params,
    }))

    setIsDirty(true)
  }

  return (
    <div className="document-editor mb-5">
      {
        doc === undefined
          ? <>Loading&hellip;</>
          : <>
            <div className="container-fluid">
              <div className="row mx-n3 g-3 align-items-center mb-2">
                <div className="col flex-grow-1">
                  <h1 className="border-bottom">
                    {
                      doc.id === undefined
                        ? 'New Document'
                        : `Document ${doc.id}`
                    }
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
              value={doc.body}
              onChange={body => updateDocument({ body })} />
          </>
      }
    </div>
  )
}

export default DocumentEditor
