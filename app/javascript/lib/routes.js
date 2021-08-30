const buildUrl = ({ projectId, keywordId, documentId }) => {
  let url = ''

  if (projectId === undefined) {
    return '/'
  } else {
    url += `/projects/${projectId}`

    if (keywordId !== undefined) {
      url += `/keywords/${keywordId}`
    }

    url += '/documents'

    if (documentId !== undefined) {
      url += `/${documentId}`
    }

    return url
  }
}

export { buildUrl }
