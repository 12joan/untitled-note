import React from 'react'
import { useEffect } from 'react'

import { useContext } from 'lib/context'

/* ⚠️ 
 * Don't forget to update KeyboardNavigationModal with changes
 */

const keyBindings = event => {
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

  return {
  // Document shortcuts
    't': () => select(document.querySelector('.document-editor .title-input')),
    'k': () => select(document.querySelector('.document-editor .react-tags__search-input')),
    'i': () => focus(document.querySelector('.document-editor trix-editor')),
    'm': () => focus(document.querySelector('.document-editor .document-dropdown-button')),
    'f': () => focus(document.querySelector('.document-editor .toggle-formatting-controls')),
    'arrowdown': () => changeFocusedDocument(1),
    'arrowup': () => changeFocusedDocument(-1),

    // General shortcuts
    'escape': () => blur(event.target),
    'backspace': () => click(document.querySelector('#back-button')),
    'n': () => click(document.querySelector('#new-document-button')),
    's': () => click(document.querySelector('#toggle-sidebar-button')),
    'a': () => click(document.querySelector('#all-documents-link')),
    'p': () => {
      click(document.querySelector('#all-projects-link'))
      focus(document.querySelector('.btn-project.selected'))
    },
    'shift+d': () => focus(document.querySelector('.document-grid-tile .document-grid-tile-label a')),
    'shift+s': () => focus(document.querySelector('#sidebar-focusable')),
    'shift+n': () => {
      focus(document.querySelector('#sidebar-focusable'))
      focus(document.querySelector('.navigation-menu-item.active'))
    },
    'shift+p': () => focus(document.querySelector('#pinned-documents-section .navigation-menu-item')),
    'shift+k': () => focus(document.querySelector('#keywords-section .navigation-menu-item')),
    'shift+t': () => focus(document.querySelector('#top-bar')),
    'shift+?': () => click(document.querySelector('#keyboard-navigation-button')),
  }
}

const KeyboardShortcutHandler = props => {
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

      const handler = keyBindings(event)[key]

      if (handler !== undefined) {
        event.preventDefault()
        handler()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return props.children
}

export default KeyboardShortcutHandler
