import React from 'react'

const DocumentPlaceholder = props => {
  return (
    <div className={`placeholder-wave ${props.fullHeight ? 'flex-grow-1' : ''} d-flex flex-column`}>
      <div className="document-placeholder flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1" style={{ minHeight: '194.2px' }} />
      </div>
    </div>
  )
}

export default DocumentPlaceholder
