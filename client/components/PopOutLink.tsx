import React, { ElementType, ReactNode } from 'react';
import { PolyProps } from '~/lib/polymorphic';
import CaretRightIcon from '~/components/icons/CaretRightIcon';

export type PopOutLinkProps<C extends ElementType> = PolyProps<
  C,
  {
    label: string;
    children: ReactNode;
  }
>;

export const PopOutLink = <C extends ElementType = 'a'>({
  as,
  label,
  children,
  ...otherProps
}: PopOutLinkProps<C>) => {
  const LinkComponent = as || 'a';

  return (
    <LinkComponent
      className="btn btn-link-subtle flex items-center gap-0 hocus:gap-3 group transition-[gap]"
      {...otherProps}
    >
      {children}

      <div className="flex items-center gap-1 translate-y-0.5">
        <span className="whitespace-nowrap overflow-hidden w-0 group-hocus:w-full transition-[width] font-medium">
          {label}
        </span>

        <CaretRightIcon noAriaLabel />
      </div>
    </LinkComponent>
  );
};
