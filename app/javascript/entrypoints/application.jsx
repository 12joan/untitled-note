import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import cssHasPseudo from 'css-has-pseudo/browser'

import '~/channels'
import '~/stylesheets/application.scss'

import App from '~/components/layout/App'

cssHasPseudo(document, { hover: true })

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

if (!isTouchDevice) {
  let wasInFocus = undefined

  setInterval(() => {
    const inFocus = document.hasFocus()

    if (inFocus !== wasInFocus) {
      wasInFocus = inFocus

      if (inFocus) {
        document.body.classList.remove('inactive')
      } else {
        document.body.classList.add('inactive')
      }
    }
  }, 100)
}

/* React 18 causes a lot of issues with useElementSize, so we're intentionally
 * using the old render API to trigger React 17 mode. The console.error
 * monkeypatch suppresses the message from React about this.
 */

const originalConsoleError = console.error

console.error = (message, ...otherArgs) => {
  if (message?.startsWith?.('Warning: ReactDOM.render is no longer supported in React 18')) {
    return
  }

  originalConsoleError(message, ...otherArgs)
}

document.addEventListener('DOMContentLoaded', () =>
  ReactDOM.render(
    <BrowserRouter children={<App />} />,
    document.querySelector('#application')
  )
)
