import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import '~/channels'
import '~/lib/commonEntrypoint'

import App from '~/components/layout/App'

document.addEventListener('DOMContentLoaded', () =>
  ReactDOM.render(
    <BrowserRouter children={<App />} />,
    document.querySelector('#application')
  )
)
