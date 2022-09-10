import Rails from '@rails/ujs'
import React from 'react'
import ReactDOM from 'react-dom'
import * as ActiveStorage from '@rails/activestorage'
import 'channels'
import 'bootstrap'
import 'stylesheets/application'

import App from '~/components/App'

Rails.start()
ActiveStorage.start()

require('trix')
require('@rails/actiontext')

require('~/lib/trixNewlinePatch')
require('~/lib/trixDialogPatch')
require('~/lib/trixMentionPatch')
require('~/lib/trixDefinitiveMentionPatch')

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.querySelector('#application'),
  )
})
