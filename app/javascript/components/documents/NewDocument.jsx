import React from 'react'
import DocumentEditor from 'components/documents/DocumentEditor'

const NewDocument = props => {
  return (
    <div className="p-4">
      <DocumentEditor document={{
        title: '',
        body: '',
      }} fullHeight openable />
    </div>
  )
}

export default NewDocument
