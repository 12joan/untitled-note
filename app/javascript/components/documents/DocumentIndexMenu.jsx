import React from 'react'

import LinkSelect from 'components/LinkSelect'

const DocumentIndexMenu = props => {
  return (
    <>
      <div className="px-3 py-1">
        Sort by
        {' '}
        <LinkSelect
          value={props.sortParameter}
          onChange={props.setSortParameter}
          options={{
            'created_at': 'recently created',
            'updated_at': 'recently updated',
          }} />
      </div>
    </>
  )
}

export default DocumentIndexMenu
