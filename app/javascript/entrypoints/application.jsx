import React from 'react'
import { createRoot } from 'react-dom/client'
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

document.addEventListener('DOMContentLoaded', () =>
  createRoot(document.querySelector('#application')).render(
    <BrowserRouter children={<App />} />
  )
)
