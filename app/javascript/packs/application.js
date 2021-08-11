// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from '@rails/ujs'
import React from 'react'
import ReactDOM from 'react-dom'
import * as ActiveStorage from '@rails/activestorage'
import 'channels'
import 'bootstrap'
import 'stylesheets/application'

import App from 'components/App'

Rails.start()
ActiveStorage.start()

require('trix')
require('@rails/actiontext')

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.querySelector('#application'),
  )
})
