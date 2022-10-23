import React, { useRef } from 'react'
import { useLocation } from 'react-router-dom'

import useGlobalKeyboardShortcut from '~/lib/useGlobalKeyboardShortcut'
import { OverviewLink } from '~/lib/routes'

import CaretLeftIcon from '~/components/icons/CaretLeftIcon'

const BackButton = ({ className: userClassName, ...otherProps }) => {
  const linkRef = useRef()

  const { state } = useLocation()
  const { linkOriginator = undefined } = state || {}

  const label = linkOriginator ?? 'Overview'

  const linkProps = {
    ref: linkRef,
    ...otherProps,
    className: `btn btn-link flex items-center gap-1 font-medium ${userClassName}`,
    children: <>
      <CaretLeftIcon noAriaLabel />
      {label}
    </>,
  }

  useGlobalKeyboardShortcut('MetaAltArrowUp', event => {
    event.preventDefault()
    event.stopPropagation()
    linkRef.current?.click()
  })

  return linkOriginator
    ? <button type="button" onClick={() => window.history.back()} {...linkProps} />
    : <OverviewLink preventScrollReset={false} {...linkProps} />
}

export default BackButton
