import React from 'react'
import { ArrowClockwise as Refresh } from 'react-bootstrap-icons'

import { useContext } from 'lib/context'

import LinkSelect from 'components/LinkSelect'

const SortingControls = props => {
  const { view, sortParameter, setSortParameter, reloadDocumentIndex } = useContext()

  if (view.type !== 'index') {
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
      {' '}
      <button
        type="button"
        className="btn btn-icon btn-icon-inline"
        title="Refresh"
        onClick={reloadDocumentIndex}>
        <Refresh className="bi" />
        <span className="visually-hidden">Refresh view</span>
      </button>
    </>
  )
}

export default SortingControls
