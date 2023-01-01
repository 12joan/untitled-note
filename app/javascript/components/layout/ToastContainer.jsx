import React, { useState, useEffect } from 'react'
import { useElementSize } from 'usehooks-ts'

import { useGlobalEvent } from '~/lib/globalEvents'
import { useTimeout } from '~/lib/useTimer'

import LargeCloseIcon from '~/components/icons/LargeCloseIcon'

const AUTO_CLOSE_DURATION = {
  none: null,
  fast: 5000,
  slow: 30000,
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  useGlobalEvent('toast', toast => setToasts([
    {
      ...toast,
      key: toasts.length,
    },
    ...toasts,
  ]), [toasts])

  return (
    <div aria-live="polite" aria-atomic="true" className="fixed inset-0 flex flex-col items-end justify-start p-5 pointer-events-none z-50 gap-5 overflow-y-auto overflow-x-hidden">
      {toasts.map(({ key, ...toast }) => (
        <Toast key={key} {...toast} />
      ))}
    </div>
  )
}

const Toast = ({ title, message, autoClose, button = null }) => {
  const [visible, setVisible] = useState(false)
  const [inDOM, setInDOM] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const [ref, { height: toastHeight }] = useElementSize()

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
  }, [])

  const close = () => {
    setIsClosing(true)
    setTimeout(() => setVisible(false), 50)
    setTimeout(() => setInDOM(false), 300)
  }

  const autoCloseDuration = AUTO_CLOSE_DURATION[autoClose]
  autoCloseDuration && useTimeout(close, autoCloseDuration)

  return inDOM && (
    <div
      ref={ref}
      className="pointer-events-auto bg-slate-100/75 backdrop-blur shadow-dialog rounded-2xl dark:bg-slate-800/75 flex gap-8 p-4 items-start max-w-full transition-[margin,transform]"
      style={{
        position: toastHeight > 0 ? undefined : 'absolute',
        transitionProperty: (visible || isClosing) ? undefined : 'none',
        marginBottom: visible ? 0 : `calc(-${toastHeight}px - 1rem)`,
        transform: visible ? 'translateX(0)' : 'translateX(110%)',
      }}
    >
      <div className="shrink-1 w-96 space-y-1 select-none">
        <strong className="font-medium">{title}</strong>

        <p className="text-sm">{message}</p>

        {button && (
          <button
            type="button"
            className="btn btn-link font-medium"
            onClick={() => {
              button.onClick()
              close()
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
  )
}

export default ToastContainer
