import { useCallback, useId, useState } from 'react';
import { dispatchGlobalEvent, useGlobalEvent } from '~/lib/globalEvents';
import { useStableGetter } from '~/lib/useStableGetter';

export interface UseModalRenderProps {
  open: boolean;
  onClose: () => void;
}

export interface UseModalOptions {
  onOpen?: () => void;
  onClose?: () => void;
}

export const useModal = <T = undefined,>(
  render: (modalProps: UseModalRenderProps, openProps: T) => JSX.Element,
  { onOpen, onClose }: UseModalOptions = {}
) => {
  const id = useId();

  const [openProps, setOpenProps] = useState<T | null>(null);
  const isOpen = openProps !== null;
  const getIsOpen = useStableGetter(isOpen);

  type OpenOptions = T extends undefined ? [] : [T];

  const open = useCallback(
    (...args: OpenOptions) => {
      if (!getIsOpen()) {
        setOpenProps(args[0] as T);
        onOpen?.();
        dispatchGlobalEvent('modal:open', id);
      }
    },
    [onOpen]
  );

  const close = useCallback(() => {
    if (getIsOpen()) {
      setOpenProps(null);
      onClose?.();
      dispatchGlobalEvent('modal:close', id);
    }
  }, [onClose]);

  const toggle = useCallback(
    (...args: OpenOptions) => {
      if (getIsOpen()) {
        close();
      } else {
        open(...args);
      }
    },
    [close, open, getIsOpen]
  );

  useGlobalEvent(
    'modal:open',
    (openedId) => {
      if (openedId !== id) {
        close();
      }
    },
    [id, close]
  );

  const modal = isOpen
    ? render({ open: isOpen, onClose: close }, openProps)
    : null;

  return { modal, open, close, toggle, isOpen };
};
