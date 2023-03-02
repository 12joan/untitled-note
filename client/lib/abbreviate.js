import { substr } from 'runes'

const abbreviate = (text, maxLength) => text
  .split(' ')
  .filter(word => word.length > 0)
  .slice(0, maxLength)
  .map(word => substr(word, 0, 1).toUpperCase())
  .join('')

export default abbreviate
