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
    .then(response => {
      if (String(response.status).match(/2\d{2}/)) {
        return response
      }

      return Promise.reject({
        notOkayStatus: true,
        response,
      })
    })
}

export default fetchAPIEndpoint
