import React from 'react'
import { useEffect } from 'react'
import { Modal, Offcanvas } from 'bootstrap'

import { useContext } from 'lib/context'

/* ⚠️ 
 * Don't forget to update KeyboardNavigationModal with changes
 */

const keyBindings = (event, context) => {
  // Limit keyboard shortcuts to the currently open modal of offcanvas if present
  const scope = document.querySelector('.modal.show') || document.querySelector('.offcanvas.show') || document

  const focus = element => {
    if (scope.contains(element)) {
      element?.focus()
    }
  }

  const blur = element => {
    if (scope.contains(element)) {
      element?.blur()
    }
  }

  const select = element => {
    if (scope.contains(element)) {
      focus(element)
      element?.select()
    }
  }

  const click = element => {
    if (scope.contains(element)) {
      element?.click()
    }
  }

  const sendSidebarEvent = eventType => {
    if (scope.contains(document.querySelector('#sidebar'))) {
      context.sendSidebarEvent.invoke(eventType)
    }
  }

  return {
  // Document shortcuts
    't': () => select(document.querySelector('.document-editor .title-input')),
    'k': () => select(document.querySelector('.document-editor .react-tags__search-input')),
    'i': () => focus(document.querySelector('.document-editor trix-editor')),
    'm': () => focus(document.querySelector('.document-editor .document-dropdown-button')),

    // General shortcuts
    'escape': () => {
      let modalOrOffcanvas

      if (modalOrOffcanvas = document.querySelector('.modal.show')) {
        Modal.getInstance(modalOrOffcanvas).hide()
        event.stopPropagation()
      } else if (modalOrOffcanvas = document.querySelector('.offcanvas.show')) {
        Offcanvas.getInstance(modalOrOffcanvas).hide()
        event.stopPropagation()
      } else {
        blur(event.target)
      }
    },
    'backspace': () => click(document.querySelector('#back-button')),
    'n': () => click(document.querySelector('#new-document-button')),
    's': () => sendSidebarEvent('toggle'),
    'a': () => click(document.querySelector('#all-documents-link')),
    'p': () => click(document.querySelector('#all-projects-link')),
    'shift+n': () => {
      sendSidebarEvent('show')
      focus(document.querySelector('.navigation-menu .focus-target'))
      focus(document.querySelector('.navigation-menu-item.active'))
    },
    'shift+p': () => {
      sendSidebarEvent('show')
      focus(document.querySelector('#pinned-documents-section .navigation-menu-item'))
    },
    'shift+k': () => {
      sendSidebarEvent('show')
      focus(document.querySelector('#keywords-section .navigation-menu-item'))
    },
    'shift+d': () => focus(document.querySelector('.document-grid-tile .document-grid-tile-label a')),
    'shift+t': () => focus(document.querySelector('#top-bar .focus-target')),
    'shift+?': () => click(document.querySelector('#keyboard-navigation-button')),
  }
}

const KeyboardShortcutHandler = props => {
  const context = useContext()

  useEffect(() => {
    const onKeyDown = event => {
      // Prevent unintentionally overriding browser or OS keyboard shortcuts
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      if (event.target.matches('input, textarea, select, [contenteditable]') && event.key !== 'Escape') {
        return
      }

      const key = `${event.shiftKey ? 'shift+' : ''}${event.key.toLowerCase()}`

      const handler = keyBindings(event, context)[key]

      if (handler !== undefined) {
        event.preventDefault()
        handler()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)

    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [])

  return props.children
}

export default KeyboardShortcutHandler
