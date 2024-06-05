import React, { useEffect, useState } from 'react';
import { useGlobalEvent } from '~/lib/globalEvents';
import { createToast } from '~/lib/toasts';
import { Toast as ToastData } from '~/lib/types';
import { useElementSize } from '~/lib/useElementSize';
import { useTimeout } from '~/lib/useTimer';
import LargeCloseIcon from '~/components/icons/LargeCloseIcon';

const AUTO_CLOSE_DURATION = {
  none: null,
  fast: 5000,
  slow: 30000,
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useGlobalEvent(
    'toast:upsert',
    (toast: ToastData) => {
      const toastIndex = toasts.findIndex((t) => t.id === toast.id);

      if (toastIndex === -1) {
        setToasts((toasts) => [toast, ...toasts]);
      } else {
        const newToasts = [...toasts];
        newToasts[toastIndex] = toast;
        setToasts(newToasts);
      }
    },
    [toasts]
  );

  // Convert flash messages from server to toasts
  useEffect(() => {
    const flashMessages = Array.from(
      document.querySelectorAll<HTMLDivElement>('.flash-message')
    );

    flashMessages.forEach((el) => {
      const [message, title, autoClose] = el.innerText
        .split('/')
        .map((x) => x.trim());
      createToast({
        title,
        message,
        autoClose: (autoClose ?? 'fast') as any,
      });
      el.remove();
    });
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-end justify-start p-5 pointer-events-none z-50 gap-5 overflow-y-auto overflow-x-hidden">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

const Toast = ({
  id,
  title,
  message,
  autoClose,
  ariaLive = 'polite',
  button,
}: ToastData) => {
  const [targetState, setTargetState] = useState<'open' | 'closed'>('open');
  const [visible, setVisible] = useState(false);
  const [inDOM, setInDOM] = useState(true);

  const [{ height: toastHeight }, ref] = useElementSize();

  useTimeout(() => setVisible(targetState === 'open'), 50, [targetState]);

  useTimeout(
    () => {
      if (targetState === 'closed') {
        setInDOM(false);
      }
    },
    300,
    [targetState]
  );

  const close = () => setTargetState('closed');

  const reopen = () => {
    setInDOM(true);
    setTargetState('open');
  };

  const autoCloseDuration = AUTO_CLOSE_DURATION[autoClose];
  useTimeout(close, autoCloseDuration);

  useGlobalEvent(
    'toast:close',
    (toastId: string) => {
      if (toastId === id && targetState !== 'closed') {
        close();
      }
    },
    [id, targetState]
  );

  useGlobalEvent(
    'toast:reopen',
    (toastId: string) => {
      if (toastId === id && targetState !== 'open') {
        reopen();
      }
    },
    [id, targetState]
  );

  if (!inDOM) return null;

  const resolvedMessage =
    typeof message === 'function' ? message() : <p>{message}</p>;

  const buttonElement = button && (
    <button
      type="button"
      className="btn btn-rect btn-modal-secondary text-sm max-w-48"
      onClick={() => {
        button.onClick();
        close();
      }}
    >
      {button.label}
    </button>
  );

  return (
    <div
      ref={ref}
      className="pointer-events-auto bg-plain-100/75 backdrop-blur shadow-dialog rounded-2xl dark:bg-plain-800/75 flex gap-8 p-4 items-start max-w-full transition-[margin,transform] w-[30rem]"
      style={{
        position: toastHeight > 0 ? undefined : 'absolute',
        transitionProperty:
          visible || targetState === 'closed' ? undefined : 'none',
        marginBottom: visible ? 0 : `calc(-${toastHeight}px - 1rem)`,
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
      }}
      aria-live={ariaLive}
      aria-hidden="false"
    >
      <div className="grow shrink-1 space-y-1 select-none">
        <strong className="font-medium">{title}</strong>

        <div className="space-y-1 text-sm">{resolvedMessage}</div>

        <div className="xs:hidden">{buttonElement}</div>
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0 -my-2 -mr-2 justify-between">
        <button
          type="button"
          className="btn btn-no-rounded rounded-full p-2 apsect-square hover:bg-plain-200/75 dark:hover:bg-plain-700/75 text-plain-400 dark:text-plain-500 hover:text-plain-500 dark:hover:text-plain-400"
          onClick={close}
          aria-label="Close"
        >
          <LargeCloseIcon size="1.25em" noAriaLabel />
        </button>

        <div className="max-xs:hidden">{buttonElement}</div>
      </div>
    </div>
  );
};
