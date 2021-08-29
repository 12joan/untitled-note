import React from 'react'

import BackButton from 'components/layout/BackButton'

const ContentHeader = props => {
  return (
    <div className="d-flex gap-3 align-items-center">
      <div className="py-1">
        <BackButton />
      </div>

      <div className="flex-grow-1 mx-auto text-center py-1" style={{ width: 0 }}>
        {props.children}
      </div>
    </div>
  )
}

export default ContentHeader
