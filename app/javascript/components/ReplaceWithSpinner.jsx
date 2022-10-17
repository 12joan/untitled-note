import React from 'react'

import SpinnerIcon from '~/components/icons/SpinnerIcon'

const ReplaceWithSpinner = ({ isSpinner = false, spinnerAriaLabel, children }) => {
  return (
    <>
      <div style={{ opacity: isSpinner ? 0 : undefined }}>
        {children}
      </div>

      {isSpinner && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-live="polite" aria-label={spinnerAriaLabel}>
          <SpinnerIcon size="1.25em" className="animate-spin" noAriaLabel />
        </div>
      )}
    </>
  )
}

export default ReplaceWithSpinner
