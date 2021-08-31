class RecordCache {
  constructor() {
    this.cachedRecords = {}
  }

  push(key, record) {
    this.cachedRecords[key] = record
  }

  pull(key) {
    return this.cachedRecords[key]
  }

  cachePromise(key, promiseProvider) {
    const cached = this.pull(key)

    if (cached === undefined) {
      return promiseProvider()
        .then(record => {
          this.push(key, record)
          return record
        })
    } else {
      return Promise.resolve(cached)
    }
  }
}

export default RecordCache
