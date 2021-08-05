import React from 'react'
import DocumentEditor from 'components/documents/DocumentEditor'

const ShowDocument = props => {
  return (
    <div className="p-4">
      <DocumentEditor id={props.id} fullHeight />
    </div>
  )
}

export default ShowDocument
