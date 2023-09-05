import { useCallback, useId, useState } from 'react';
import { dispatchGlobalEvent, useGlobalEvent } from '~/lib/globalEvents';

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

  type OpenOptions = T extends undefined ? [] : [T];

  const open = useCallback(
    (...args: OpenOptions) => {
      setOpenProps(args[0] as T);
      onOpen?.();
      dispatchGlobalEvent('closeAllModalsExcept', id);
    },
    [onOpen]
  );

  const close = useCallback(() => {
    setOpenProps(null);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(
    (...args: OpenOptions) => {
      if (isOpen) {
        close();
      } else {
        open(...args);
      }
    },
    [close, open, isOpen]
  );

  useGlobalEvent(
    'closeAllModalsExcept',
    (exceptId) => {
      if (exceptId !== id) {
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
