import React from 'react'

import groupedClassNames from '~/lib/groupedClassNames'

import LargeCloseIcon from '~/components/icons/LargeCloseIcon'

const WithCloseButton = ({ onClose, customClassNames, children }) => {
  const className = groupedClassNames({
    display: 'flex',
    items: 'items-center',
    justify: 'justify-between',
    gap: 'gap-2',
  }, customClassNames)

  return (
    <div className={className}>
      {children}

      <button
        type="button"
        className="btn btn-no-rounded rounded-full p-2 aspect-square shrink-0"
        onClick={onClose}
      >
        <LargeCloseIcon size="1.25em" ariaLabel="Close" />
      </button>
    </div>
  )
}

export default WithCloseButton
