import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap'
import 'trix'
import '@rails/actiontext'

import '~/channels'
import '~/stylesheets/application.scss'
import '~/lib/trixNewlinePatch'
import '~/lib/trixDialogPatch'
import '~/lib/trixMentionPatch'
import '~/lib/trixDefinitiveMentionPatch'
import App from '~/components/App'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.querySelector('#application'),
  )
})
