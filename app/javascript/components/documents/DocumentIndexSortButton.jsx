import React from 'react'
import { SortAlphaDown } from 'react-bootstrap-icons'

import LinkSelect from '~/components/LinkSelect'

const DocumentIndexSortButton = props => {
  return (
    <LinkSelect
      value={props.sortParameter}
      onChange={props.setSortParameter}
      beforeOptions={
        <li><h6 className="dropdown-header">Sort by</h6></li>
      }
      options={{
        'created_at': 'Recently created',
        'updated_at': 'Recently modified',
      }}>
      <button
        type="button"
        className="btn btn-lg btn-icon btn-icon-inline text-primary"
        title="TODO: change me"
        data-bs-toggle="dropdown"
        aria-expanded="false">
        <SortAlphaDown className="bi" />
        <span className="visually-hidden">TODO: change me</span>
      </button>
    </LinkSelect>
  )
}

export default DocumentIndexSortButton
