import React from 'react'
import { useState, useContext, useEffect } from 'react'
import { TrixEditor } from 'react-trix'
import { Link } from 'react-router-dom'
import { BoxArrowUpRight, ThreeDots, Palette, At as Mention } from 'react-bootstrap-icons'
import { v4 as uuid } from 'uuid'
import ProjectContext from 'lib/contexts/ProjectContext'
import RouteConfig from 'lib/RouteConfig'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

const DocumentEditor = props => {
  const [editorUUID] = useState(() => uuid())

  const toolbarId = `trix-toolbar-${editorUUID}`
  const toolbarCollapseId = `${toolbarId}-collapse`

  const [doc, setDoc] = useState(props.id === undefined ? { title: '', body: '' } : undefined)
  const [isDirty, setIsDirty] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const projectId = useContext(ProjectContext)

  useEffect(() => {
    if (props.id !== undefined) {
      DocumentsAPI(projectId).show(props.id)
        .then(setDoc)
    }
  }, [props.id])

  useEffect(() => {
    if (isDirty && !isUploading) {
      setIsUploading(true)

      const uploadDocumentPromise = doc.id === undefined
        ? DocumentsAPI(projectId).create(doc).then(setDoc)
        : DocumentsAPI(projectId).update(doc)

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
    <div className={`document-editor ${props.fullHeight ? 'h-100' : ''} d-flex flex-column`}>
      {
        doc === undefined
          ? <>Loading&hellip;</>
          : (
            <>
              <div className="container-fluid">
                {
                  props.openable && (
                    <div className="document-editor-header dim-on-hover position-relative d-flex justify-content-center align-items-center">
                      <Link
                        to={RouteConfig.projects.show(projectId).documents.show(doc.id).url}
                        className="stretched-link document-editor-header-link text-secondary text-decoration-none">
                        <BoxArrowUpRight className="bi" /> Open document
                      </Link>
                    </div>
                  )
                }

                <div className="row gx-3 align-items-center mb-2">
                  <div className="col flex-grow-1">
                    <input
                      className="title-input"
                      value={doc.title}
                      placeholder="Title"
                      onChange={event => updateDocument({ title: event.target.value })} />
                  </div>

                  <div className="col-auto">
                    <button className="btn btn-icon fs-4 text-secondary">
                      <ThreeDots className="bi" />
                      <span className="visually-hidden">Toggle dropdown menu</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-grow-1 d-flex flex-column position-relative">
                <TrixEditor
                  toolbar={toolbarId}
                  placeholder="Add document body"
                  value={doc.body}
                  onChange={body => updateDocument({ body })} />

                <div className="document-editor-footer position-sticky bottom-0 mt-3 py-3">
                  <div className="container-fluid">
                    <div className="row gx-3 align-items-center mb-n3">
                      <div className="col mb-3">
                        <div className="collapse" style={{ marginBottom: '-10px' }} id={toolbarCollapseId}>
                          <trix-toolbar id={toolbarId} />
                        </div>
                      </div>

                      <div className="col-auto ms-auto mb-3">
                        <button
                          className="btn btn-icon fs-5 text-secondary ms-1"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#${toolbarCollapseId}`}
                          title="Toggle formatting controls"
                          aria-expanded="false"
                          aria-controls={toolbarCollapseId}>
                          <Palette className="bi" />
                          <span className="visually-hidden">Toggle formatting controls</span>
                        </button>

                        <button
                          className="btn btn-icon fs-5 text-secondary ms-1"
                          type="button"
                          title="Related documents">
                          <Mention className="bi" style={{ transform: 'scale(140%)' }} />
                          <span className="visually-hidden">Open related documents sidebar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
      }
    </div>
  )
}

export default DocumentEditor
