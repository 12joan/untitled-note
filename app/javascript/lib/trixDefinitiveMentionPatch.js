import Trix from 'trix'

Trix.config.textAttributes.definitiveMention = {
  tagName: 'x-definitive-mention',
  inheritable: false,
  parser: element => element.tagName === 'X-DEFINITIVE-MENTION',
}

class DefinitiveMention extends HTMLElement {}
customElements.define('x-definitive-mention', DefinitiveMention)
