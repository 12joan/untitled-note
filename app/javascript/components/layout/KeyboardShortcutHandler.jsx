import React from 'react'
import { useEffect } from 'react'

import { useContext } from 'lib/context'

/* ⚠️ 
 * Don't forget to update KeyboardNavigationModal with changes
 */

const keyBindings = focusedDocument => {
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

  const changeFocusedDocument = delta => {
    focusedDocument.then(doc => {
      const allDocuments = [...document.querySelectorAll('.document-editor')]
      focus(allDocuments[allDocuments.indexOf(doc) + delta])
    })
  }

  return {
  // Document shortcuts
    't': () => select(focusedDocument.then(doc => doc.querySelector('.title-input'))),
    'k': () => select(focusedDocument.then(doc => doc.querySelector('.react-tags__search-input'))),
    'i': () => focusedDocument.then(doc => {
      click(doc.querySelector('.show-more-button'))
      focus(doc.querySelector('trix-editor'))
    }),
    'm': () => focus(focusedDocument.then(doc => doc.querySelector('.document-dropdown-button'))),
    'o': () => click(focusedDocument.then(doc => doc.querySelector('.open-document-button'))),
    'f': () => focus(focusedDocument.then(doc => doc.querySelector('.toggle-formatting-controls'))),
    'arrowdown': () => changeFocusedDocument(1),
    'arrowup': () => changeFocusedDocument(-1),

    // General shortcuts
    'escape': () => {
      for (let node = event.target; node.parentNode !== null; node = node.parentNode) {
        if (node.matches?.('.document-editor')) {
          focus(node)
          return
        }
      }

      blur(event.target)
    },
    'n': () => click(document.querySelector('#new-document-button')),
    's': () => click(document.querySelector('#toggle-sidebar-button')),
    'a': () => click(document.querySelector('#all-documents-link')),
    'p': () => {
      click(document.querySelector('#all-projects-link'))
      focus(document.querySelector('.btn-project.selected'))
    },
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
  const { focusedDocument } = useContext()

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

      const handler = keyBindings(focusedDocument)[key]

      if (handler !== undefined) {
        event.preventDefault()
        handler()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [focusedDocument])

  return props.children
}

export default KeyboardShortcutHandler
