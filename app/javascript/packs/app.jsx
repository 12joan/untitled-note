import React from 'react'
import ReactDOM from 'react-dom'

import App from 'components/App'

require('trix')
require('@rails/actiontext')

require('lib/trixNewlinePatch')
require('lib/trixDialogPatch')

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.querySelector('#application'),
  )
})
