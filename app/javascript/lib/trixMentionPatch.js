import Trix from 'trix'

Trix.config.textAttributes.mention = {
  tagName: 'x-mention',
  inheritable: false,
}

class Mention extends HTMLElement {}
customElements.define('x-mention', Mention)
