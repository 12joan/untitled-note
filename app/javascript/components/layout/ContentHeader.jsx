import React from 'react'

import BackButton from 'components/layout/BackButton'
import SortingControls from 'components/layout/SortingControls'

const ContentHeader = props => {
  return (
    <div className="border-bottom p-3 d-flex justify-content-between">
      <div>
        <BackButton />
      </div>

      <div>
        <SortingControls />
      </div>
    </div>
  )
}

export default ContentHeader
