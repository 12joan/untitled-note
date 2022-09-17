import React from 'react'

import LoadDocument from '~/components/documents/LoadDocument'
// import DocumentEditor from '~/components/documents/DocumentEditor'
import Editor from '~/components/Editor'

const EditorView = ({ documentId }) => {
  return (
    <div className="grow flex flex-col">
      <LoadDocument
        id={documentId}
        loading={() => <p>Loading...</p>}
        success={doc => (
          <Editor upstreamDocument={doc} />
        )}
      />
    </div>
  )
}

export default EditorView
