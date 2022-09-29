import React from 'react'
import { useLocation } from 'react-router-dom'

import {
  OverviewLink,
  RecentlyViewedLink,
  TagsLink,
} from '~/lib/routes'

import CaretLeftIcon from '~/components/icons/CaretLeftIcon'

const BackButton = ({ className: userClassName, ...otherProps }) => {
  const { state } = useLocation()

  const { label, as: Link } = {
    DEFAULT: {
      label: 'Overview',
      as: OverviewLink,
    },
    recentlyViewed: {
      label: 'Recently viewed',
      as: RecentlyViewedLink,
    },
    allTags: {
      label: 'All tags',
      as: TagsLink,
    },
  }[state?.linkOriginator ?? 'DEFAULT']

  const className = `btn btn-link flex items-center gap-1 font-medium ${userClassName}`

  return (
    <Link className={className} {...otherProps}>
      <CaretLeftIcon noAriaLabel />
      {label}
    </Link>
  )
}

export default BackButton
