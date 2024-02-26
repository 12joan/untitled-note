import React, {
  ComponentType,
  ForwardedRef,
  forwardRef,
  RefObject,
  useLayoutEffect,
} from 'react';
import UpstreamHeadedTippy, {
  TippyProps as UpstreamTippyProps,
} from '@tippyjs/react';
import UpstreamTippy from '@tippyjs/react/headless';
import { Instance } from 'tippy.js';
import { useAppContext } from '~/lib/appContext';
import { mapRef, setRef } from '~/lib/refUtils';

import 'tippy.js/dist/tippy.css';

export type TippyProps = Omit<UpstreamTippyProps, 'ref'>;
export type TippyInstance = Instance;

const makeTippyComponent = (
  TippyComponent: ComponentType<UpstreamTippyProps>
) =>
  forwardRef(
    (
      { children, reference, ...props }: TippyProps,
      forwardedRef: ForwardedRef<TippyInstance>
    ) => {
      const ref =
        forwardedRef &&
        mapRef(
          forwardedRef,
          (element: Element) =>
            element && ((element as any)._tippy as TippyInstance)
        );

      const inModal = useAppContext('inModal') || false;

      const childrenWithFallback =
        children ||
        (reference ? <ConnectRef reference={reference} /> : undefined);

      return (
        <TippyComponent ref={ref} zIndex={inModal ? 40 : 20} {...props}>
          {childrenWithFallback}
        </TippyComponent>
      );
    }
  );

interface ConnectRefProps {
  reference: Element | RefObject<Element>;
}

const ConnectRef = forwardRef(
  ({ reference }: ConnectRefProps, ref: ForwardedRef<Element | null>) => {
    useLayoutEffect(() => {
      if (ref) {
        const referenceEl =
          'current' in reference ? reference.current : reference;
        setRef(ref, referenceEl);
      }
    }, [ref, reference]);

    return null;
  }
);

export const HeadedTippy = makeTippyComponent(UpstreamHeadedTippy);
export const Tippy = makeTippyComponent(UpstreamTippy);
