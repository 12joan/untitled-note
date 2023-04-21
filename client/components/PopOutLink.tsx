import React, { ComponentType, ReactNode } from 'react'

import CaretRightIcon from '~/components/icons/CaretRightIcon'

export interface PopOutLinkProps<T> {
  as: ComponentType<T>
  asProps: T
  label: string
  children: ReactNode
}

export const PopOutLink = <T,>({
  as: LinkComponent,
  asProps,
  label,
  children,
}: PopOutLinkProps<T>) => {
  return (
    <LinkComponent
      className="btn btn-link-subtle flex items-center gap-0 hocus:gap-3 group transition-[gap]"
      {...asProps}
    >
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
