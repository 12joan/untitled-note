import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import '~/channels'
import '~/stylesheets/application.scss'

import App from '~/components/App'

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

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BrowserRouter children={<App />} />,
    document.querySelector('#application'),
  )
})
