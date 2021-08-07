import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeftFill } from 'react-bootstrap-icons'

const ContentArea = props => {
  const backButtonUI = props.backButton !== undefined && (
    <Link to={props.backButton.url} className="text-decoration-none">
      <CaretLeftFill className="bi" /> {props.backButton.label}
    </Link>
  )

  const scrollableArea = (
    <div className="flex-grow-1 overflow-scroll bg-light">
      {props.children}
    </div>
  )

  return (
    <>
      <div className="border-bottom p-3 d-flex justify-content-between">
        <div>
          {backButtonUI || null}
        </div>

        <div>
          {props.sortingControls || null}
        </div>
      </div>

      {scrollableArea}
    </>
  )
}

export default ContentArea
