import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '~/channels'
import '~/lib/commonEntrypoint'

import App from '~/components/layout/App'

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.querySelector('#application'))

  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
})
