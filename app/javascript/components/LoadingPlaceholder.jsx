import React from 'react'
import { useState } from 'react'

import classList from '~/lib/classList'

const LoadingPlaceholder = props => {
  return (
    <div className={classList([props.className, 'position-relative'])}>
      <div className="layout-row gap-1 position-absolute top-50 start-50 translate-middle text-secondary" role="status">
        {
          ['0s', '0.125s', '0.25s'].map((delay, i) => (
            <span key={i} className="spinner-grow spinner-grow-sm" style={{ animationDelay: delay }} />
          ))
        }

        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default LoadingPlaceholder
