import { useState } from 'react';

export type UseModalRenderProps = {
  open: boolean;
  onClose: () => void;
};

export const useModal = <T = undefined,>(
  render: (modalProps: UseModalRenderProps, openProps: T | null) => JSX.Element
) => {
  const [openProps, setOpenProps] = useState<T | null>(null);
  const isOpen = openProps !== null;

  type OpenOptions = T extends undefined ? [] : [T];

  const open = (...args: OpenOptions) => setOpenProps(args[0] as T);
  const close = () => setOpenProps(null);

  const toggle = (...args: OpenOptions) => {
    if (isOpen) {
      close();
    } else {
      open(...args);
    }
  };

  const modal = render({ open: isOpen, onClose: close }, openProps);

  return { modal, open, close, toggle, isOpen };
};
