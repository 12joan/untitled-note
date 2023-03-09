import React from 'react'

import CaretRightIcon from '~/components/icons/CaretRightIcon'

const PopOutLink = ({ as: LinkComponent, label, children }) => {
  return (
    <LinkComponent className="btn btn-link-subtle flex items-center gap-0 hocus:gap-3 group transition-[gap]">
      {children}

      <div className="flex items-center gap-1 translate-y-0.5">
        <span className="whitespace-nowrap overflow-hidden w-0 group-hocus:w-full transition-[width] font-medium">
          {label}
        </span>

        <CaretRightIcon noAriaLabel />
      </div>
    </LinkComponent>
  )
}

export default PopOutLink
