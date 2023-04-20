import React, { forwardRef } from 'react'

import { HeadedTippy, TippyInstance, TippyProps } from '~/components/Tippy'

export { TippyInstance };

export interface TooltipProps extends TippyProps {
  fixed?: boolean;
}

export const Tooltip = forwardRef(({
  onCreate = () => {},
  onDestory = () => {},
  fixed = false,
  popperOptions = {},
  ...otherProps
}: TooltipProps, ref: React.Ref<TippyInstance>) => {
  const setRef = value => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(value)
      } else {
        ref.current = value
      }
    }
  }

  return (
    <HeadedTippy
      theme="custom"
      arrow={false}
      onCreate={tippy => {
        setRef(tippy)
        onCreate(tippy)
      }}
      onDestroy={tippy => {
        setRef(null)
        onDestory(tippy)
      }}
      popperOptions={{
        ...(fixed ? { strategy: 'fixed' } : {}),
        ...popperOptions,
      }}
      touch={false}
      {...otherProps}
    />
  )
})
