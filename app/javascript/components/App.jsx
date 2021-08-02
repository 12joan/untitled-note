import React from 'react'
import { useState, useEffect } from 'react'
import DocumentsAPI from 'lib/resources/DocumentsAPI'
import DocumentEditor from 'components/DocumentEditor'

const App = props => {
  const [existingDocuments, setExistingDocuments] = useState(undefined)

  useEffect(() => DocumentsAPI.index().then(setExistingDocuments), [])

  return (
    <div className="container p-3">
      {
        existingDocuments === undefined
          ? <>Loading&hellip;</>
          : existingDocuments.map(({ id }) => (
            <DocumentEditor key={id} id={id} />
          ))
      }

      <DocumentEditor />
    </div>
  )
}

export default App
