import React from 'react'
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

import { useContext } from 'lib/context'
import DocumentsAPI from 'lib/resources/DocumentsAPI'

import DocumentEditorHeader from 'components/documents/editor/DocumentEditorHeader'
import DocumentEditorTitleBar from 'components/documents/editor/DocumentEditorTitleBar'
import DocumentEditorKeywords from 'components/documents/editor/DocumentEditorKeywords'
import DocumentEditorBodyEditor from 'components/documents/editor/DocumentEditorBodyEditor'
import DocumentEditorFooter from 'components/documents/editor/DocumentEditorFooter'

const DocumentEditor = props => {
  const { projectId } = useContext()

  const [doc, setDoc] = useState(props.document)

  const isDeleted = doc.deleted_at !== null
  const readOnly = isDeleted || props.readOnly

  const [localVersion, setLocalVersion] = useState(0)
  const [remoteVersion, setRemoteVersion] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [updatePromiseCallbacks, setUpdatePromiseCallbacks] = useState([])

  const [editorUUID] = useState(() => uuid())

  const toolbarId = `trix-toolbar-${editorUUID}`

  useEffect(() => {
    if (localVersion > remoteVersion && !isUploading) {
      setIsUploading(true)
      const uploadingVersion = localVersion

      const callbacks = updatePromiseCallbacks.filter(({ version }) => uploadingVersion >= version)

      DocumentsAPI(projectId).update(doc)
        .then(afterUpdate)
        .catch(error => {
          console.error(error)
          callbacks.forEach(callback => callback.reject(error))
        })
        .then(() => {
          setRemoteVersion(uploadingVersion)
          setIsUploading(false)
          callbacks.forEach(callback => callback.resolve())
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

      return new Promise((resolve, reject) => {
        setUpdatePromiseCallbacks(callbacks => [
          ...callbacks,
          { version: localVersion, resolve, reject },
        ])
      })
    }
  }

  const afterUpdate = updatedDoc => {
    updateDocument({
      keywords: doc.keywords.map(oldKeyword => {
        const newKeyword = updatedDoc.keywords.find(keyword => keyword.text === oldKeyword.text)

        if (oldKeyword.id === undefined && newKeyword !== undefined) {
          return newKeyword
        } else {
          return oldKeyword
        }
      }),
    }, false)
  }

  return (
    <div className={`document-editor ${readOnly ? 'readOnly' : ''}`}>
      <div className="container-fluid">
        <DocumentEditorHeader
          doc={doc}
          openable={props.openable} />

        <DocumentEditorTitleBar
          doc={doc}
          readOnly={readOnly}
          isDeleted={isDeleted}
          editorUUID={editorUUID}
          updateDocument={updateDocument} />
      </div>

      <div className="row mb-2">
        <div className="col">
          <DocumentEditorKeywords
            keywords={doc.keywords}
            updateDocument={updateDocument}
            readOnly={readOnly} />
        </div>
      </div>

      <div>
        {
          readOnly
            ? <div className="trix-editor" dangerouslySetInnerHTML={{ __html: doc.body }} />
            : (
              <DocumentEditorBodyEditor 
                doc={doc}
                toolbarId={toolbarId}
                updateDocument={updateDocument} />
            )
        }

        <DocumentEditorFooter
          toolbarId={toolbarId}
          readOnly={readOnly} />
      </div>
    </div>
  )
}

export default DocumentEditor
