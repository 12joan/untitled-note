import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { TrixEditor } from 'react-trix'
import { BoxArrowUpRight, ThreeDots, Palette, At as Mention } from 'react-bootstrap-icons'
import { v4 as uuid } from 'uuid'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import NavLink from 'components/NavLink'
import DocumentEditorKeywords from 'components/documents/DocumentEditorKeywords'

const DocumentEditor = props => {
  const { projectId, keywords: allKeywords, reloadKeywords, setParams } = useContext()

  const [doc, setDoc] = useState(props.document)

  const [localVersion, setLocalVersion] = useState(0)
  const [remoteVersion, setRemoteVersion] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const [editorUUID] = useState(() => uuid())

  const toolbarId = `trix-toolbar-${editorUUID}`
  const toolbarCollapseId = `${toolbarId}-collapse`

  const editorEl = useRef()

  const handleEditorReady = () => {
    const editor = editorEl.current.editor
    editor.loadHTML(doc.body)
  }

  useEffect(() => {
    if (localVersion > remoteVersion && !isUploading) {
      setIsUploading(true)
      const uploadingVersion = localVersion

      const documentsAPI = DocumentsAPI(projectId)

      const uploadDocumentPromise = doc.id === undefined
        ? documentsAPI.create(doc).then(afterCreate)
        : documentsAPI.update(doc).then(afterUpdate)

      uploadDocumentPromise
        .catch(console.error)
        .then(() => {
          setRemoteVersion(uploadingVersion)
          setIsUploading(false)
        })
    }
  }, [localVersion, remoteVersion, isUploading])

  const updateDocument = (params, incrementLocalVersion = true) => {
    setDoc(doc => ({
      ...doc,
      ...params,
    }))

    if (incrementLocalVersion) {
      setLocalVersion(localVersion => localVersion + 1)
    }
  }

  const afterCreate = createdDoc => {
    updateDocument({ id: doc.id }, false)
    updateLocalKeywords(createdDoc)
  }

  const afterUpdate = updatedDoc => {
    updateLocalKeywords(updatedDoc)
  }

  const updateLocalKeywords = updatedDoc => {
    updateDocument({
      keywords: doc.keywords.map(oldKeyword => {
        const newKeyword = updatedDoc.keywords.find(keyword => keyword.text === oldKeyword.text)

        if (oldKeyword.id === undefined && newKeyword !== undefined) {
          reloadKeywords()
          return newKeyword
        } else {
          return oldKeyword
        }
      }),
    }, false)
  }

  return (
    <div className={`document-editor ${props.fullHeight ? 'h-100' : ''} d-flex flex-column`}>
      <div className="container-fluid">
        {
          props.openable && doc.id !== undefined && (
            <div className="document-editor-header dim-on-hover position-relative d-flex justify-content-center align-items-center">
              <NavLink
                className="stretched-link document-editor-header-link text-secondary text-decoration-none"
                params={{ documentId: doc.id }}>
                <BoxArrowUpRight className="bi" /> Open document
              </NavLink>
            </div>
          )
        }

        <div className="row gx-3 align-items-center">
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

      <div className="row">
        <div className="col">
          <DocumentEditorKeywords keywords={doc.keywords} updateDocument={updateDocument} />
        </div>
      </div>

      <div className="flex-grow-1 d-flex flex-column position-relative">
        <TrixEditor
          ref={editorEl}
          toolbar={toolbarId}
          placeholder="Add document body"
          onEditorReady={handleEditorReady}
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
    </div>
  )
}

export default DocumentEditor
