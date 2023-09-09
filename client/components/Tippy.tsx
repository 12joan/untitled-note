import React, { ComponentType, ForwardedRef, forwardRef } from 'react';
import UpstreamHeadedTippy, {
  TippyProps as UpstreamTippyProps,
} from '@tippyjs/react';
import UpstreamTippy from '@tippyjs/react/headless';
import { Instance } from 'tippy.js';
import { useAppContext } from '~/lib/appContext';
import { mapRef } from '~/lib/refUtils';

import 'tippy.js/dist/tippy.css';

export type TippyProps = Omit<UpstreamTippyProps, 'ref'>;
export type TippyInstance = Instance;

const makeTippyComponent = (
  TippyComponent: ComponentType<UpstreamTippyProps>
) =>
  forwardRef((props: TippyProps, forwardedRef: ForwardedRef<TippyInstance>) => {
    const ref =
      forwardedRef &&
      mapRef(
        forwardedRef,
        (element: Element) =>
          element && ((element as any)._tippy as TippyInstance)
      );

    const inModal = useAppContext('inModal') || false;
    return <TippyComponent ref={ref} zIndex={inModal ? 40 : 20} {...props} />;
  });

export const HeadedTippy = makeTippyComponent(UpstreamHeadedTippy);
export const Tippy = makeTippyComponent(UpstreamTippy);
