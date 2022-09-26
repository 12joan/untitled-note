import React from 'react'

import useTitle from '~/lib/useTitle'
import { routesComponent } from '~/lib/routes'

import ToastContainer from '~/components/layout/ToastContainer'

const App = () => {
  useTitle('Note App')

  return (
    <>
      {routesComponent}
      <ToastContainer />
    </>
  )
}

export default App
