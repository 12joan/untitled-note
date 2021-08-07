const fetchAPIEndpoint = (apiEndpoint, options = {}) => {
  let url = apiEndpoint.url(...(options.urlArgs || []))

  if (options.searchParams !== undefined) {
    url += '?' + new URLSearchParams(options.searchParams).toString()
  }

  return fetch(url, {
    method: apiEndpoint.method || 'GET',

    headers: {
      'X-CSRF-Token': document.querySelector('[name=\'csrf-token\']').content,
      'Content-Type': 'application/json',
    },

    body: options.body,
  })
}

export default fetchAPIEndpoint
