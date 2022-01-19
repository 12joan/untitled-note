import fetchAPIEndpoint from 'lib/fetchAPIEndpoint'

class ResourcesAPI {
  constructor({ apiEndpoints, transformRequestParams, transformResponseParams, resourceId }) {
    this.apiEndpoints = apiEndpoints || []
    this.transformRequestParams = transformRequestParams || (x => x)
    this.transformResponseParams = transformResponseParams || (x => x)
    this.resourceId = resourceId || (x => x.id)
  }

  index(options = {}) {
    return fetchAPIEndpoint(this.apiEndpoints.index, options)
      .then(response => response.json())
      .then(resources => resources.map(this.transformResponseParams))
  }

  show(id) {
    return fetchAPIEndpoint(this.apiEndpoints.show, {
      urlArgs: [id],
    })
      .then(response => response.json())
      .then(this.transformResponseParams)
  }

  create(resource) {
    return fetchAPIEndpoint(this.apiEndpoints.create, {
      body: JSON.stringify(this.transformRequestParams(resource)),
    })
      .then(response => response.json())
      .then(this.transformResponseParams)
  }

  update(resource) {
    return fetchAPIEndpoint(this.apiEndpoints.update, {
      urlArgs: [this.resourceId(resource)],
      body: JSON.stringify(this.transformRequestParams(resource)),
    })
      .then(response => response.json())
      .then(this.transformResponseParams)
  }

  destroy(resource) {
    return fetchAPIEndpoint(this.apiEndpoints.destroy, {
      urlArgs: [this.resourceId(resource)],
    })
  }
}

export default ResourcesAPI
