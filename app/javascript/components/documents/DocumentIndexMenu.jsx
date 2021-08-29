import React from 'react'
import { ArrowClockwise as Refresh } from 'react-bootstrap-icons'

import LinkSelect from 'components/LinkSelect'

const DocumentIndexMenu = props => {
  return (
    <>
      <li>
        <button className="dropdown-item d-flex gap-2 align-items-center" type="button">
          <Refresh className="bi" />
          Refresh
        </button>
      </li>

      <div className="dropdown-divider" />

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
