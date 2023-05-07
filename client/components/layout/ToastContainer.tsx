import React, { useEffect, useState } from 'react';
import { useGlobalEvent } from '~/lib/globalEvents';
import { Toast as ToastProps } from '~/lib/types';
import { useElementSize } from '~/lib/useElementSize';
import { useTimeout } from '~/lib/useTimer';
import LargeCloseIcon from '~/components/icons/LargeCloseIcon';
import { Portal } from '@headlessui/react';

const AUTO_CLOSE_DURATION = {
  none: null,
  fast: 5000,
  slow: 30000,
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<(ToastProps & { key: number })[]>([]);

  useGlobalEvent(
    'toast',
    (toast: ToastProps) =>
      setToasts([
        {
          ...toast,
          key: toasts.length,
        },
        ...toasts,
      ]),
    [toasts]
  );

  return (
    <Portal>
      <div
        className="fixed inset-0 flex flex-col items-end justify-start p-5 pointer-events-none z-50 gap-5 overflow-y-auto overflow-x-hidden"
      >
        {toasts.map(({ key, ...toast }) => (
          <Toast key={key} {...toast} />
        ))}
      </div>
    </Portal>
  );
};

const Toast = ({ title, message, autoClose, ariaLive = 'polite', button }: ToastProps) => {
  const [visible, setVisible] = useState(false);
  const [inDOM, setInDOM] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const [{ height: toastHeight }, ref] = useElementSize();

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const close = () => {
    setIsClosing(true);
    setTimeout(() => setVisible(false), 50);
    setTimeout(() => setInDOM(false), 300);
  };

  const autoCloseDuration = AUTO_CLOSE_DURATION[autoClose];
  useTimeout(close, autoCloseDuration);

  if (!inDOM) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-auto bg-slate-100/75 backdrop-blur shadow-dialog rounded-2xl dark:bg-slate-800/75 flex gap-8 p-4 items-start max-w-full transition-[margin,transform]"
      style={{
        position: toastHeight > 0 ? undefined : 'absolute',
        transitionProperty: visible || isClosing ? undefined : 'none',
        marginBottom: visible ? 0 : `calc(-${toastHeight}px - 1rem)`,
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
      }}
      aria-live={ariaLive}
      aria-hidden="false"
    >
      <div className="shrink-1 w-96 space-y-1 select-none">
        <strong className="font-medium">{title}</strong>

        <p className="text-sm">{message}</p>

        {button && (
          <button
            type="button"
            className="btn btn-link font-medium"
            onClick={() => {
              button.onClick();
              close();
            }}
          >
            {button.label}
          </button>
        )}
      </div>

      <button
        type="button"
        className="btn btn-no-rounded rounded-full p-2 apsect-square hover:bg-slate-200/75 dark:hover:bg-slate-700/75 text-slate-400 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-400"
        onClick={close}
      >
        <LargeCloseIcon size="1.25em" ariaLabel="Close" />
      </button>
    </div>
  );
};
