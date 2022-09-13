import React, { useState, useEffect } from 'react'

import useTitle from '~/lib/useTitle'
import { routesComponent } from '~/lib/routes'

const App = () => {
  useTitle('Note App')
  return routesComponent
}

export default App
