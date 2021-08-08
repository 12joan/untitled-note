import React from 'react'

import { useContext } from 'lib/context'

import LinkSelect from 'components/LinkSelect'

const SortingControls = props => {
  const { documentId, sortParameter, setSortParameter } = useContext()

  if (documentId !== undefined) {
    return null
  }

  return (
    <>
      Sort by
      {' '}
      <LinkSelect
        value={sortParameter}
        onChange={setSortParameter}
        options={{
          'created_at': 'recently created',
          'updated_at': 'recently updated',
        }} />
    </>
  )
}

export default SortingControls
