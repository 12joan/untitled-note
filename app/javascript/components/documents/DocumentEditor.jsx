import React from 'react'
import { useState, useEffect, useRef } from 'react'
import ReactTags from 'react-tag-autocomplete'
import { TrixEditor } from 'react-trix'
import { BoxArrowUpRight, ThreeDots, Palette, At as Mention, X as Cross } from 'react-bootstrap-icons'
import { v4 as uuid } from 'uuid'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import NavLink from 'components/NavLink'

const DocumentEditor = props => {
  const { projectId, keywords: allKeywords, reloadKeywords, setParams } = useContext()

  const documentsAPI = DocumentsAPI(projectId)

  const [editorUUID] = useState(() => uuid())

  const editorEl = useRef()

  const [doc, setDoc] = useState(props.document)

  const [localVersion, setLocalVersion] = useState(0)
  const [remoteVersion, setRemoteVersion] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const toolbarId = `trix-toolbar-${editorUUID}`
  const toolbarCollapseId = `${toolbarId}-collapse`

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

  const afterCreate = createdDoc => {
    updateDocument({ id: doc.id }, false)
    updateLocalKeywords(createdDoc)
  }

  const afterUpdate = updatedDoc => {
    updateLocalKeywords(updatedDoc)
  }

  useEffect(() => {
    if (localVersion > remoteVersion && !isUploading) {
      setIsUploading(true)
      const uploadingVersion = localVersion

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

  const handleEditorReady = () => {
    const editor = editorEl.current.editor
    editor.loadHTML(doc.body)
  }

  const tags = doc.keywords.map(keyword => ({ id: keyword.id, name: keyword.text }))

  console.log(tags.map(tag => tag.id))

  const setTags = mapFunction => updateDocument({
    keywords: mapFunction(tags).map(tag => ({ text: tag.name })),
  })

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
          <ReactTags
            tags={tags}
            suggestions={allKeywords.map(keyword => ({ id: keyword.id, name: keyword.text }))}
            minQueryLength={1}
            placeholderText="Add keywords..."
            removeButtonText="Remove keyword"
            noSuggestionsText="Keyword not found"
            allowNew
            newTagText="New keyword:"
            onAddition={tag => (
              setTags(tags => ([
                ...tags,
                tag,
              ]))
            )}
            onDelete={index => (
              setTags(tags => {
                let newTags = tags.slice(0)
                newTags.splice(index, 1)
                return newTags
              })
            )}
            tagComponent={({ tag, removeButtonText, onDelete }) => (
              <div className="keyword-tag d-inline-block position-relative rounded-pill p-1 mb-2 me-2 text-primary">
                <span className="mx-1">
                  {tag.name}
                </span>

                <NavLink
                  className="stretched-link"
                  params={{ keywordId: tag.id, documentId: undefined }} />

                <button
                  className="btn-delete position-relative border-0 p-0 rounded-circle text-primary"
                  style={{ width: '1.2em', height: '1.2em', zIndex: 2 }}
                  title={removeButtonText}
                  onClick={onDelete}
                  title={removeButtonText}>
                  <Cross className="bi" />
                  <span className="visually-hidden">{removeButtonText}</span>
                </button>
              </div>
            )} />
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
