import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'

import '~/channels'
import '~/lib/commonEntrypoint'
import { IS_ELECTRON } from '~/lib/environment'

import App from '~/components/layout/App'

const ElectronNavigation = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.electron.onNavigate((event, delta) => navigate(delta))
  }, [])
}

document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.querySelector('#application'))

  root.render(
    <BrowserRouter>
      {IS_ELECTRON && <ElectronNavigation />}
      <App />
    </BrowserRouter>
  )
})
