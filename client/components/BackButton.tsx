import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { OverviewLink } from '~/lib/routes';
import { useGlobalKeyboardShortcut } from '~/lib/useGlobalKeyboardShortcut';
import CaretLeftIcon from '~/components/icons/CaretLeftIcon';

export interface BackButtonProps extends Record<string, any> {
  className?: string;
}

export const BackButton = ({
  className: userClassName = '',
  ...otherProps
}: BackButtonProps) => {
  const linkRef = useRef<any>();

  const { state } = useLocation();
  const { linkOriginator = undefined } = state || {};

  const label = linkOriginator ?? 'Overview';

  const linkProps = {
    ref: linkRef,
    ...otherProps,
    className: `btn btn-link flex items-center gap-1 font-medium ${userClassName}`,
    children: (
      <>
        <CaretLeftIcon noAriaLabel />
        {label}
      </>
    ),
  };

  // TODO: Deprecate useGlobalKeyboardShortcut
  useGlobalKeyboardShortcut('MetaAltArrowUp', (event) => {
    event.preventDefault();
    event.stopPropagation();
    linkRef.current?.click();
  });

  return linkOriginator ? (
    <button
      type="button"
      onClick={() => window.history.back()}
      {...linkProps}
    />
  ) : (
    <OverviewLink {...linkProps} />
  );
};
