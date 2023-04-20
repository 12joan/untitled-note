import React, { forwardRef } from 'react'
import UpstreamHeadedTippy, {
  Instance,
  TippyProps,
} from '@tippyjs/react'
import UpstreamTippy from '@tippyjs/react/headless'
import 'tippy.js/dist/tippy.css'

import { useContext } from '~/lib/context'

export type TippyInstance = Instance;
export { TippyProps };

const useTippyProps = () => {
  const { inModal = false } = useContext() as {
    inModal: boolean
  }

  return {
    zIndex: inModal ? 40 : 20,
  };
};

export const HeadedTippy = forwardRef((props: TippyProps, ref) => {
  const tippyProps = useTippyProps();

  return (
    <UpstreamHeadedTippy
      ref={ref}
      {...tippyProps}
      {...props}
    />
  );
});

export const Tippy = forwardRef((props: TippyProps, ref) => {
  const tippyProps = useTippyProps();

  return (
    <UpstreamTippy
      ref={ref}
      {...tippyProps}
      {...props}
    />
  );
});
