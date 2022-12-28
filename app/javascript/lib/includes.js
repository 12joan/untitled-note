import { localeIncludes } from 'locale-includes'

const includes = (haystack, needle) => localeIncludes(haystack, needle, { usage: 'search', sensitivity: 'base' })

export default includes
