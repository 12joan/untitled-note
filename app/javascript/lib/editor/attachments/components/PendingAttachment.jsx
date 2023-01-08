import React from 'react'

import groupedClassNames from '~/lib/groupedClassNames'
import commonClassNames from '../commonClassNames'

import LoadingView from '~/components/LoadingView'

const PendingAttachment = ({ selectedClassNames }) => {
  const className = groupedClassNames(commonClassNames, selectedClassNames, {
    padding: 'p-5',
  })

  return (
    <div className={className}>
      <LoadingView style={{ paddingBottom: 0 }} showImmediately />
    </div>
  )
}

export default PendingAttachment
