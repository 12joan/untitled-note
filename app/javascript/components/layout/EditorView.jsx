import React from 'react'

import LoadDocument from '~/components/documents/LoadDocument'
import DocumentEditor from '~/components/documents/DocumentEditor'

const EditorView = ({ documentId }) => {
  return (
    <div className="p-5 max-w-screen-md mx-auto text-black dark:text-white">
      <LoadDocument
        id={documentId}
        loading={() => <p>Loading...</p>}
        success={doc => (
          <DocumentEditor document={doc} />
        )}
      />
    </div>
  )
}

export default EditorView
