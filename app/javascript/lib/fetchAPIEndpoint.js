const fetchAPIEndpoint = (apiEndpoint, options = {}) => (
  fetch(apiEndpoint.url(...(options.urlArgs || [])), {
    method: apiEndpoint.method || 'GET',

    headers: {
      'X-CSRF-Token': document.querySelector('[name=\'csrf-token\']').content,
      'Content-Type': 'application/json',
    },

    body: options.body,
  })
)

export default fetchAPIEndpoint
