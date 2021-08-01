import React from 'react'
import { useState, useEffect } from 'react'
import DocumentEditor from 'components/DocumentEditor'

const App = props => {
  const [existingDocuments, setExistingDocuments] = useState([])

  useEffect(() => {
    fetch('/api/v1/documents.json')
      .then(response => response.json())
      .then(setExistingDocuments)
      .catch(console.error)
  }, [])

  return (
    <div className="container p-3">
      {
        existingDocuments.map(document => (
          <DocumentEditor key={document.id} document={document} />
        ))
      }
    </div>
  )
}

export default App
