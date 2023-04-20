import React, { forwardRef, ForwardedRef, ComponentType } from 'react'
import UpstreamHeadedTippy, {
  TippyProps as UpstreamTippyProps,
} from '@tippyjs/react'
import { Instance } from 'tippy.js'
import UpstreamTippy from '@tippyjs/react/headless'
import 'tippy.js/dist/tippy.css'

import { useContext } from '~/lib/context'
import { mapRef } from '~/lib/refUtils'

export type TippyProps = Omit<UpstreamTippyProps, 'ref'>;
export type TippyInstance = Instance;

const makeTippyComponent = (
  TippyComponent: ComponentType<UpstreamTippyProps>
) => forwardRef((
  props: TippyProps,
  forwardedRef: ForwardedRef<TippyInstance>
) => {
  const ref = forwardedRef && mapRef(forwardedRef, (element: Element) => (
    element && ((element as any)._tippy as TippyInstance)
  ))

  const { inModal = false } = useContext() as {
    inModal: boolean
  }

  return (
    <TippyComponent
      ref={ref}
      zIndex={inModal ? 40 : 20}
      {...props}
    />
  );
});

export const HeadedTippy = makeTippyComponent(UpstreamHeadedTippy);
export const Tippy = makeTippyComponent(UpstreamTippy);
