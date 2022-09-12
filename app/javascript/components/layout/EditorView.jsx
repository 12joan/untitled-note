import React from 'react'

import LoadDocument from '~/components/documents/LoadDocument'
import DocumentEditor from '~/components/documents/DocumentEditor'

const EditorView = () => {
  return (
    <div className="p-5 max-w-screen-md mx-auto space-y-3 text-black dark:text-white">
      {/* <h1 className="text-3xl font-medium">My First Document</h1> */}
      <LoadDocument
        id="1"
        loading={() => <p>Loading...</p>}
        success={doc => (
          <DocumentEditor document={doc} />
        )}
      />
    </div>
  )
}

export default EditorView
