import { useState } from 'react';

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
  const [openProps, setOpenProps] = useState<T | null>(null);
  const isOpen = openProps !== null;

  type OpenOptions = T extends undefined ? [] : [T];

  const open = (...args: OpenOptions) => {
    setOpenProps(args[0] as T);
    onOpen?.();
  };

  const close = () => {
    setOpenProps(null);
    onClose?.();
  };

  const toggle = (...args: OpenOptions) => {
    if (isOpen) {
      close();
    } else {
      open(...args);
    }
  };

  const modal = isOpen
    ? render({ open: isOpen, onClose: close }, openProps)
    : null;

  return { modal, open, close, toggle, isOpen };
};
