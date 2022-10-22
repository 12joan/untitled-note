import cssHasPseudo from 'css-has-pseudo/browser'

import '~/stylesheets/application.scss'

cssHasPseudo(document, { hover: true })

const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

if (!isTouchDevice) {
  let wasInFocus = undefined

  setInterval(() => {
    const inFocus = document.hasFocus()

    if (inFocus !== wasInFocus) {
      wasInFocus = inFocus

      if (inFocus) {
        document.body.classList.remove('inactive')
      } else {
        document.body.classList.add('inactive')
      }
    }
  }, 100)
}

new MutationObserver(mutations => mutations.forEach(({ type, target }) => {
  // childList refers to the addition or removal of nodes in the DOM tree;
  // no relation to ul or ol specifically
  if (type === 'childList') {
    const orderedLists = target.matches('ol') ? [target] : target.querySelectorAll('ol')

    orderedLists.forEach(list => {
      const digits = Math.max(Math.floor(Math.log10(list.children.length)) + 1, 0)
      list.style.setProperty('--list-style-offset', `${digits}ch`)
    })
  }
})).observe(document.body, { childList: true, subtree: true })

/* React 18 causes a lot of issues with useElementSize, so we're intentionally
 * using the old render API to trigger React 17 mode. The console.error
 * monkeypatch suppresses the message from React about this.
 */

const originalConsoleError = console.error

console.error = (message, ...otherArgs) => {
  if (message?.startsWith?.('Warning: ReactDOM.render is no longer supported in React 18')) {
    return
  }

  originalConsoleError(message, ...otherArgs)
}
