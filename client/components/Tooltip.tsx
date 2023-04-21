import React, { ForwardedRef, forwardRef } from 'react';
import { HeadedTippy, TippyInstance, TippyProps } from '~/components/Tippy';

export type { TippyInstance };

export interface TooltipProps extends TippyProps {
  fixed?: boolean;
}

export const Tooltip = forwardRef(
  (
    { fixed = false, popperOptions = {}, ...otherProps }: TooltipProps,
    ref: ForwardedRef<TippyInstance>
  ) => {
    return (
      <HeadedTippy
        ref={ref}
        theme="custom"
        arrow={false}
        popperOptions={{
          ...(fixed ? { strategy: 'fixed' } : {}),
          ...popperOptions,
        }}
        touch={false}
        {...otherProps}
      />
    );
  }
);
