import React from 'react'
import { useLocation } from 'react-router-dom'

import { OverviewLink } from '~/lib/routes'

import CaretLeftIcon from '~/components/icons/CaretLeftIcon'

const BackButton = ({ className: userClassName, ...otherProps }) => {
  const { state } = useLocation()
  const { linkOriginator = undefined } = state || {}

  const label = linkOriginator ?? 'Overview'

  const linkProps = {
    ...otherProps,
    className: `btn btn-link flex items-center gap-1 font-medium ${userClassName}`,
    children: <>
      <CaretLeftIcon noAriaLabel />
      {label}
    </>,
  }

  return linkOriginator
    ? <button type="button" onClick={() => window.history.back()} {...linkProps} />
    : <OverviewLink preventScrollReset={false} {...linkProps} />
}

export default BackButton
