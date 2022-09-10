import React from 'react'

import BackButton from '~/components/layout/BackButton'

const ContentHeader = props => {
  return (
    <div className="d-flex gap-3 justify-content-between align-items-center" style={{ minHeight: '2.5rem' }}>
      <div className="py-1 flex-1 mw-fit-content text-start">
        <BackButton />
      </div>

      <div className="py-1 text-center">
        {props.middle}
      </div>

      <div className="py-1 flex-1 mw-fit-content text-end">
        {props.right}
      </div>
    </div>
  )
}

export default ContentHeader
